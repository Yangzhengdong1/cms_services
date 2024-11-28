const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const { queryDepartment } = require("../services/dept.service");
const { queryRole } = require("../services/role.service");

const verifyCreate = async (ctx, next) => {
  console.log("角色校验 Middleware: verifyCreate~");

	const { name, departmentId, description, permissions } = ctx.request.body;

	if (!name || !departmentId) {
		ctx.app.emit("message", "角色名称/部门不能为空！", ctx);
		return;
	}

  if (!Array.isArray(permissions)) {
    ctx.app.emit("message", "permissions字段需要为数组类型！", ctx);
    return;
  }

  // 判断角色名称是否重复
  const res = await queryRole("name", name);
  if (Array.isArray(res) && !!res.length) {
		ctx.app.emit("message", "角色名称重复！", ctx);
    return;
  }

	// 判断 departmentId 是否存在
	const result = await queryDepartment("wid", departmentId);

	if (Array.isArray(result) && !result.length) {
		ctx.app.emit("message", "部门不存在！", ctx);
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
