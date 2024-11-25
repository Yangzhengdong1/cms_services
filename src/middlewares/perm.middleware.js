const { queryPermission } = require("../services/perm.service");

const {
	PERM_CREATE_ARGUMENT_IS_NOT_EMPTY,
	PERM_CREATE_NAME_IS_EXIST
} = require("@/constant/messages");

const verifyCreate = async (ctx, next) => {
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
