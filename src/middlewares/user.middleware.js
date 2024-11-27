const {
	CREATE_USER_ARGUMENT_IS_NOT_EMPTY,
	ROLE_NOT_FOUND,
	DEPM_NOT_FOUND,
  ROLE_AND_DEPM_DO_NOT_MATCH
} = require("@/constant/messages");
const {
	createError,
	ACCOUNT_ALREADY_EXISTS,
	INTERNAL_PROBLEMS,
	NO_PERMISSION
} = require("../constant/error-types");
const { hashEncryption } = require("../utils/bcrypt");

const { queryUserExist } = require("../services/user.service");
const { queryRole } = require("../services/role.service");
const { queryDepartment } = require("../services/depm.service");

/**
 * @description: 处理用户创建参数（不允许重名/必填参数：name、password、phone）
 * @param {*} ctx
 * @param {*} next
 */
const verifyCreate = async (ctx, next) => {
	console.log("userMiddleware: verifyCreate~");

	const { name, password, phone, departmentId, roleId, isActive } =
		ctx.request.body;

	// 判断必传参数
	const requiredFields = [name, password, phone];
	const flag = requiredFields.every(item => !!item === true);
	if (!flag) {
		ctx.app.emit("message", CREATE_USER_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	// 判断数据库中是否已有当前用户
	const result = await queryUserExist("name", name);
	let roleResult,
		depmResult,
		roleName = null,
		departmentName = null;

	if (
		Object.prototype.toString.call(result) === "[object Array]" &&
		result.length > 0
	) {
		createError(ACCOUNT_ALREADY_EXISTS, ctx);
		return;
	}

	// 查询角色名称
	if (roleId) {
		roleResult = await queryRole("wid", roleId);
		console.log(roleResult, "roleResult");
		if (
			Object.prototype.toString.call(roleResult) === "[object Array]" &&
			roleResult.length > 0
		) {
			roleName = roleResult[0].name;
		} else {
			ctx.app.emit("message", ROLE_NOT_FOUND, ctx);
			return;
		}
	}

	// 查询所属部门名称
	if (departmentId) {
		depmResult = await queryDepartment("wid", departmentId);
		if (
			Object.prototype.toString.call(depmResult) === "[object Array]" &&
			depmResult.length > 0
		) {
			departmentName = depmResult[0].name;
		} else {
			ctx.app.emit("message", DEPM_NOT_FOUND, ctx);
			return;
		}
	}

	// 查询当前角色是否在对应的部门下
	if (roleName && roleResult[0].department_id !== departmentId) {
		ctx.app.emit("message", ROLE_AND_DEPM_DO_NOT_MATCH, ctx);
		return;
	}

	if (result === false || roleResult === false || depmResult === false) {
		createError(INTERNAL_PROBLEMS, ctx);
		return;
	}

	const params = {
		username: name,
		password: hashEncryption(password),
		phone,
		departmentId: departmentId ? departmentId : null,
		roleId: roleId ? roleId : null,
		isActive: isActive ? isActive : 1,
		roleName,
		departmentName
	};

	ctx.user = { createParams: params };

	await next();
};

/**
 * @description: 处理查询用户信息参数（必填参数：id）
 * @param {*} ctx
 * @param {*} next
 */
const verifyInfo = async (ctx, next) => {
	const { id } = ctx.params;
	const { wid } = ctx.auth.userInfo;

	// todo:这里之后需要查询权限，看当前角色是否有查询用户信息(query_user_info)的权限

	if (id !== wid) {
		createError(NO_PERMISSION, ctx);
		return;
	}

	await next();
};

module.exports = {
	verifyCreate,
	verifyInfo
};
