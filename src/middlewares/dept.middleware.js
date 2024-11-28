const {
	DEPT_CREATE_ARGUMENT_IS_NOT_EMPTY,
	DEPT_NAME_IS_EXIST,
	DEPT_NOT_FOUND
} = require("../constant/messages.js");

const { queryDepartment } = require("../services/dept.service.js");

const verifyCreate = async (ctx, next) => {
	console.log("部门校验 Middleware: verifyCreate~");

	const { name, parentId } = ctx.request.body;
	if (!name) {
		ctx.app.emit("message", DEPT_CREATE_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	// 判断当前部门名称是否存在
	const result = await queryDepartment("name", name);
	if (
		Object.prototype.toString.call(result) === "[object Array]" &&
		result.length > 0
	) {
		ctx.app.emit("message", DEPT_NAME_IS_EXIST, ctx);
		return;
	}

	// 判断 parentId 是否存在
	if (parentId) {
		const res = await queryDepartment("wid", parentId);
		if (
			Object.prototype.toString.call(res) === "[object Array]" &&
			res.length <= 0
		) {
			ctx.app.emit("message", DEPT_NOT_FOUND, ctx);
			return;
		}
	}

	const params = {
		name,
		parentId: parentId ? parentId : null
	};
	ctx.department = { createParams: params };

	await next();
};

module.exports = {
	verifyCreate
};
