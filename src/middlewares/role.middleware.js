const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const {
	ROLE_CREATE_NAME_IS_EXIST,
	DEPT_NOT_FOUND,
	ROLE_CREATE_ARGUMENT_IS_NOT_EMPTY,
  ROLE_CREATE_ARGUMENT_TYPE_ERROR
} = require("../constant/messages");

const { queryDepartment } = require("../services/dept.service");
const { queryRole } = require("../services/role.service");

const verifyCreate = async (ctx, next) => {
	console.log("角色校验 Middleware: verifyCreate~");

	const { name, departmentId, description, permissions } = ctx.request.body;

	if (!name || !departmentId) {
		ctx.app.emit("message", ROLE_CREATE_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	if (!Array.isArray(permissions)) {
		ctx.app.emit("message", ROLE_CREATE_ARGUMENT_TYPE_ERROR, ctx);
		return;
	}

	// 判断角色名称是否重复
	const res = await queryRole("name", name);
	if (Array.isArray(res) && !!res.length) {
		ctx.app.emit("message", ROLE_CREATE_NAME_IS_EXIST, ctx);
		return;
	}

	// 判断 departmentId 是否存在
	const result = await queryDepartment("wid", departmentId);

	if (Array.isArray(result) && !result.length) {
		ctx.app.emit("message", DEPT_NOT_FOUND, ctx);
		return;
	}

	if (result === false || res === false) {
		createError(INTERNAL_PROBLEMS, ctx);
		return;
	}

	const params = {
		name,
		departmentId,
		description: description ? description : "",
		permissions
	};

	ctx.role = { createParams: params };

	await next();
};

module.exports = {
	verifyCreate
};
