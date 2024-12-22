const { queryPermission } = require("../services/perm.service");
const { queryRolePermission } = require("../services/auth.service");

const {
	createError,
	INTERNAL_PROBLEMS,
	NO_PERMISSION
} = require("../constant/error-types");
const { comparePerm } = require("../constant/permission");
const {
	PERM_CREATE_ARGUMENT_IS_NOT_EMPTY,
	PERM_CREATE_NAME_IS_EXIST
} = require("@/constant/messages");
const { SUPER_ADMIN_ID } = require("../app/config");
const { filterOptionalParams } = require("../utils/format");

/**
 * @description: 处理权限创建参数（权限名称不允许重复/必填参数：name）
 * @param {*} ctx
 * @param {*} next
 */
const verifyCreate = async (ctx, next) => {
	console.log("系统权限校验 Middleware: verifyCreate~");

	const { name, description } = ctx.request.body;
	if (!name) {
		ctx.app.emit("message", PERM_CREATE_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	// 判断权限名称是否已存在
	const result = await queryPermission("name", name);
	if (Array.isArray(result) && result.length > 0) {
		ctx.app.emit("message", PERM_CREATE_NAME_IS_EXIST, ctx);
		return;
	}

	const params = {
		name,
		description: description ? description : null
	};

	ctx.perm = { createParams: params };

	await next();
};

const verifyDelete = async (ctx, next) => {
	console.log("系统权限校验 Middleware: verifyDelete~");

  const flag = true;
  if (flag) {
    ctx.body = {
      code: -1,
      message: "暂不支持删除权限"
    };
    return;
  }


	const { id } = ctx.params;

	const result = await queryPermission("wid", id);

	if (Array.isArray(result) && !result.length) {
		ctx.app.emit("message", "权限不存在！", ctx);
		return;
	}

	await next();
};

const verifyUpdate = async (ctx, next) => {
	console.log("系统权限校验 Middleware: verifyUpdate~");

	let { wid, description } = ctx.request.body;

	if (!wid) {
		ctx.app.emit("message", "wid不能为空！", ctx);
		return;
	}

	const result = await queryPermission("wid", wid);

	if (Array.isArray(result) && !result.length) {
		ctx.app.emit("message", "wid不存在！", ctx);
		return;
	}

	if (description === null || typeof description === "undefined") {
		description = "";
	}

	ctx.perm = { updateParams: { description, wid } };

	await next();
};

const verifyPermAll = async (ctx, next) => {
	console.log("系统权限校验 Middleware: verifyPermAll~");

	const { limitParams } = ctx.public;

	const { permissionName, description, startTime, endTime } = ctx.request.body;

	const optionalParams = filterOptionalParams({
		permissionName,
		description,
		startTime,
		endTime
	});

  const params = { ...optionalParams, ...limitParams };
  ctx.perm = { getListParams: params };

	await next();
};

/**
 * @description: 判断当前角色是否有操作权限的权限/当前用户是否为超级管理员
 * @param {*} ctx
 * @param {*} next
 */
const permOperationVerify = async (ctx, next) => {
	console.log("校验操作权限的 Middleware: permOperationVerify~");

	const { wid, roleId, permName } = ctx.auth.userInfo;
	const result = await queryRolePermission(roleId);

	if (!result) {
		createError(INTERNAL_PROBLEMS, ctx);
		return;
	}

	if (!comparePerm(result, permName) && wid !== SUPER_ADMIN_ID) {
		createError(NO_PERMISSION, ctx);
		return;
	}

	await next();
};

module.exports = {
	verifyCreate,
	verifyDelete,
	verifyUpdate,
	verifyPermAll,
	permOperationVerify
};
