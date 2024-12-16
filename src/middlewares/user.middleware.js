const { INITIAL_USER_ID } = require("@/app/config");
const {
	CREATE_USER_ARGUMENT_IS_NOT_EMPTY,
	ROLE_NOT_FOUND,
	DEPT_NOT_FOUND,
	ROLE_AND_DEPT_DO_NOT_MATCH,
	USER_NOT_FOUND,
	USER_WID_IS_NOT_EMPTY,
  USER_CANNOT_BE_DELETED_INITIAL,
  USER_CANNOT_BE_DELETED_LOGIN
} = require("@/constant/messages");
const {
	createError,
	ACCOUNT_ALREADY_EXISTS,
	INTERNAL_PROBLEMS,
	NO_PERMISSION
} = require("../constant/error-types");
const { comparePerm } = require("../constant/permission");

const { hashEncryption } = require("../utils/bcrypt");

const { queryUserExist } = require("../services/user.service");
const { queryRole } = require("../services/role.service");
const { queryDepartment } = require("../services/dept.service");
const { queryRolePermission } = require("../services/auth.service");

/**
 * @description: 处理用户参数（不允许重名/必填参数：name、password、phone）
 * @param {*} ctx
 * @param {*} wid 更新用户时用到
 * @return {*} { isValid, params }
 */
const validateCondition = async (ctx, wid = "") => {
	let isValid = true;
	if (wid) {
		const result = await queryUserExist("wid", wid);
		if (Array.isArray(result) && !result.length) {
			ctx.app.emit("message", USER_NOT_FOUND, ctx);
			return { isValid: false };
		}
	}

	const {
		name,
		realname,
		password,
		phone,
		departmentId,
		roleId,
		isActive,
		avatarUrl
	} = ctx.request.body;

	// 判断必传参数
	const requiredFields = [name, realname, password, phone];
	const flag = requiredFields.every(item => !!item === true);
	if (!flag) {
		ctx.app.emit("message", CREATE_USER_ARGUMENT_IS_NOT_EMPTY, ctx);
		return { isValid: false };
	}

	// 判断数据库中是否已有当前用户
	const result = await queryUserExist("name", name);
	let roleResult,
		deptResult,
		roleName = null,
		departmentName = null;

	if (
		Object.prototype.toString.call(result) === "[object Array]" &&
		result.length > 0
	) {
		// 更新时需排除自身
		if (!wid || wid !== result[0].wid) {
			createError(ACCOUNT_ALREADY_EXISTS, ctx);
			return { isValid: false };
		}
	}

	// 查询角色名称
	if (roleId) {
		roleResult = await queryRole("wid", roleId);
		if (
			Object.prototype.toString.call(roleResult) === "[object Array]" &&
			roleResult.length > 0
		) {
			roleName = roleResult[0].name;
		} else {
			ctx.app.emit("message", ROLE_NOT_FOUND, ctx);
			return { isValid: false };
		}
	}

	// 查询所属部门名称
	if (departmentId) {
		deptResult = await queryDepartment("wid", departmentId);
		if (
			Object.prototype.toString.call(deptResult) === "[object Array]" &&
			deptResult.length > 0
		) {
			departmentName = deptResult[0].name;
		} else {
			ctx.app.emit("message", DEPT_NOT_FOUND, ctx);
			return { isValid: false };
		}
	}

	// 查询当前角色是否在对应的部门下
	if (roleName && roleResult[0].department_id !== departmentId) {
		ctx.app.emit("message", ROLE_AND_DEPT_DO_NOT_MATCH, ctx);
		return { isValid: false };
	}

	if (result === false || roleResult === false || deptResult === false) {
		createError(INTERNAL_PROBLEMS, ctx);
		return { isValid: false };
	}

	const params = {
		username: name,
		realname,
		password: hashEncryption(password),
		phone,
		departmentId: departmentId ? departmentId : null,
		roleId: roleId ? roleId : null,
		isActive: isActive ? 1 : 0,
		roleName,
		departmentName,
		avatarUrl: avatarUrl ? avatarUrl : ""
	};

	if (wid) {
		params.wid = wid;
	}

	return { isValid, params };
};

/**
 * @description:创建用户
 * @param {*} ctx
 * @param {*} next
 */
const verifyCreate = async (ctx, next) => {
	console.log("用户校验 Middleware: verifyCreate~");

	const { isValid, params } = await validateCondition(ctx);
	if (!isValid) {
		return;
	}
	ctx.user = { createParams: params };

	await next();
};

/**
 * @description: 删除用户
 * @param {*} ctx
 * @param {*} next
 */
const verifyDelete = async (ctx, next) => {
	console.log("用户校验 Middleware: verifyDelete~");

	const { id } = ctx.params;
  const { wid } = ctx.auth.userInfo;

  // 判断删除的用户是否是当前登录用户
  if (id === wid) {
    ctx.app.emit("message", USER_CANNOT_BE_DELETED_LOGIN, ctx);
    return;
  }

  // 判断删除的用户是否是初始用户
  if (id === INITIAL_USER_ID) {
    ctx.app.emit("message", USER_CANNOT_BE_DELETED_INITIAL, ctx);
    return;
  }

  // 判断用户是否存在
	const result = await queryUserExist("wid", id);
	if (Array.isArray(result) && !result.length) {
		ctx.app.emit("message", USER_NOT_FOUND, ctx);
		return;
	}

	await next();
};

/**
 * @description: 更新用户
 * @param {*} ctx
 * @param {*} next
 */
const verifyUpdate = async (ctx, next) => {
	console.log("用户校验 Middleware: verifyUpdate~");

	const { wid } = ctx.request.body;
	if (!wid) {
		ctx.app.emit("message", USER_WID_IS_NOT_EMPTY, ctx);
		return;
	}

	const { isValid, params } = await validateCondition(ctx, wid);

	if (!isValid) {
		return;
	}

	ctx.user = { updateParams: params };

	await next();
};

/**
 * @description: 处理查询用户信息参数（必填参数：id）
 * @param {*} ctx
 * @param {*} next
 */
const verifyInfo = async (ctx, next) => {
	console.log("用户校验 Middleware: verifyInfo~");

	// 查询时首先看是否是查自己的信息，如果是直接查，否则看当前用户的角色是否有查询的权限
	const { id } = ctx.params;
	const { wid } = ctx.auth.userInfo;

	const { roleId, permName } = ctx.auth.userInfo;
	const result = await queryRolePermission(roleId);

	if (id !== wid && !comparePerm(result, permName)) {
		createError(NO_PERMISSION, ctx);
		return;
	}

	await next();
};

/**
 * @description: 分页查询用户列表
 * @param {*} ctx
 * @param {*} next
 */
const verifyUserAll = async (ctx, next) => {
	console.log("用户校验 Middleware: verifyUserAll~");

	// 可选参数
	let {
		id,
		status,
		username,
    realname,
		roleName,
		roleId,
		departmentName,
		departmentId,
		phone,
		startTime,
		endTime
	} = ctx.request.body;
	const optionalParams = {
		id,
		status,
		username,
    realname,
		roleName,
		roleId,
		departmentName,
		departmentId,
		phone,
		startTime,
		endTime
	};
	for (const key in optionalParams) {
		if (Object.prototype.hasOwnProperty.call(optionalParams, key)) {
			let element = optionalParams[key];
			optionalParams[key] = element ? element : null;
		}
	}

	const { limitParams } = ctx.public;

	let params = { ...optionalParams, ...limitParams };

	ctx.user = { getListParams: params };

	await next();
};

module.exports = {
	verifyCreate,
	verifyDelete,
	verifyUpdate,
	verifyInfo,
	verifyUserAll
};
