const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const {
	ROLE_CREATE_NAME_IS_EXIST,
	DEPT_NOT_FOUND,
	ROLE_CREATE_ARGUMENT_IS_NOT_EMPTY,
	ROLE_CREATE_ARGUMENT_TYPE_ERROR,
	ROLE_NOT_FOUND,
	ROLE_WID_IS_NOT_EMPTY
} = require("../constant/messages");

const { queryDepartment } = require("../services/dept.service");
const { queryRole } = require("../services/role.service");
const { filterOptionalParams } = require("../utils/format");

/**
 * @description: 处理角色参数（不允许重名/必填参数：name、departmentId）
 * @param {*} ctx
 * @param {*} wid 更新用户时用到
 * @return {*} { isValid, params }
 */
const validateCondition = async (ctx, wid = "") => {
	if (wid) {
		const result = await queryRole("wid", wid);
		// 更新角色时判断wid是否存在
		if (Array.isArray(result) && !result.length) {
			ctx.app.emit("message", ROLE_NOT_FOUND, ctx);
			return { isValid: false };
		}
	}

	const { name, departmentId, description, level, permissions } =
		ctx.request.body;

	// 判断必填参数
	if (!name || !departmentId) {
		ctx.app.emit("message", ROLE_CREATE_ARGUMENT_IS_NOT_EMPTY, ctx);
		return { isValid: false };
	}

	// 判断权限列表字段类型
	if (!Array.isArray(permissions)) {
		ctx.app.emit("message", ROLE_CREATE_ARGUMENT_TYPE_ERROR, ctx);
		return { isValid: false };
	}

	// 判断角色名称是否重复
	const res = await queryRole("name", name);
	if (Array.isArray(res) && !!res.length) {
		// 更新时需要排除自身
		if (!wid || wid !== res[0].wid) {
			ctx.app.emit("message", ROLE_CREATE_NAME_IS_EXIST, ctx);
			return { isValid: false };
		}
	}

	// 判断 departmentId 是否存在
	const result = await queryDepartment("wid", departmentId);
	if (Array.isArray(result) && !result.length) {
		ctx.app.emit("message", DEPT_NOT_FOUND, ctx);
		return { isValid: false };
	}

	// 判断数据库查询是否出错
	if (result === false || res === false) {
		createError(INTERNAL_PROBLEMS, ctx);
		return { isValid: false };
	}

	const params = {
		name,
		departmentId,
		level: level ? level : "",
		description: description ? description : "",
		permissions,
		...(wid && { wid })
	};

	return { isValid: true, params };
};

const verifyCreate = async (ctx, next) => {
	console.log("角色校验 Middleware: verifyCreate~");

	const { isValid, params } = await validateCondition(ctx);
	if (!isValid) {
		return;
	}

	ctx.role = { createParams: params };

	await next();
};

const verifyDelete = async (ctx, next) => {
	console.log("角色校验 Middleware: verifyDelete~");

	const { id } = ctx.params;
	const result = await queryRole("wid", id);
	if (Array.isArray(result) && !result.length) {
		ctx.app.emit("message", ROLE_NOT_FOUND, ctx);
		return;
	}
	await next();
};

const verifyUpdate = async (ctx, next) => {
	const { wid } = ctx.request.body;
	if (!wid) {
		ctx.app.emit("message", ROLE_WID_IS_NOT_EMPTY, ctx);
		return;
	}

	const { isValid, params } = await validateCondition(ctx, wid);
	if (!isValid) {
		return;
	}

	ctx.role = { updateParams: params };

	await next();
};

const verifyRoleAll = async (ctx, next) => {
	console.log("角色校验 Middleware: verifyRoleAll~");

	const { limitParams } = ctx.public;
	const { roleName, description, departmentId, level, startTime, endTime } =
		ctx.request.body;

	const optionalParams = filterOptionalParams({
		roleName,
		description,
		departmentId,
		startTime,
		endTime,
		level
	});

	const params = { ...optionalParams, ...limitParams };
	ctx.role = { getListParams: params };

	await next();
};

const verifyDetail = async (ctx, next) => {
	const { id } = ctx.params;

	const result = await queryRole("wid", id);

	if (Array.isArray(result) && !result.length) {
		ctx.app.emit("message", ROLE_NOT_FOUND, ctx);
		return;
	}

	await next();
};

module.exports = {
	verifyCreate,
	verifyDelete,
	verifyUpdate,
	verifyRoleAll,
	verifyDetail
};
