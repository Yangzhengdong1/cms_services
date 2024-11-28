const { queryPermission } = require("../services/perm.service");

const {
	PERM_CREATE_ARGUMENT_IS_NOT_EMPTY,
	PERM_CREATE_NAME_IS_EXIST
} = require("@/constant/messages");

/**
 * @description: 处理权限创建参数（权限名称不允许重复/必填参数：name）
 * @param {*} ctx
 * @param {*} next
 */
const verifyCreate = async (ctx, next) => {
  console.log("用户权限校验 Middleware: verifyCreate~");

	const { name, description } = ctx.request.body;
	if (!name) {
		ctx.app.emit("message", PERM_CREATE_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	// 判断权限名称是否已存在
	const result = await queryPermission("name", name);
	if (result) {
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

module.exports = {
	verifyCreate
};
