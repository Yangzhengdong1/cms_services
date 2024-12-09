const {
	DEPT_CREATE_ARGUMENT_IS_NOT_EMPTY,
	DEPT_NAME_IS_EXIST,
	DEPT_NOT_FOUND
} = require("../constant/messages.js");
const {
	createError,
	INTERNAL_PROBLEMS
} = require("../constant/error-types.js");
const { queryDepartment } = require("../services/dept.service.js");
const { filterOptionalParams } = require("../utils/format.js");

const verifyDeptExist = async (fliedKey, fliedValue, ctx) => {
	let flag = true;
	const result = await queryDepartment(fliedKey, fliedValue);
	if (!result) {
		createError(INTERNAL_PROBLEMS, ctx);
		flag = false;
	}

	if (Array.isArray(result) && result.length <= 0) {
		ctx.app.emit("message", DEPT_NOT_FOUND, ctx);
		flag = false;
	}

	return flag;
};

const verifyCreate = async (ctx, next) => {
	console.log("部门校验 Middleware: verifyCreate~");

	const { name, parentId, menus } = ctx.request.body;
	if (!name) {
		ctx.app.emit("message", DEPT_CREATE_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	if (!Array.isArray(menus)) {
		ctx.app.emit("message", "menus字段需要为数组类型！", ctx);
		return;
	}

	// 判断当前部门名称是否存在
	const result = await queryDepartment("name", name);
	if (Array.isArray(result) && result.length > 0) {
		ctx.app.emit("message", DEPT_NAME_IS_EXIST, ctx);
		return;
	}

	// 判断 parentId 是否存在
	if (parentId) {
		const res = await queryDepartment("wid", parentId);
		if (Array.isArray(res) && res.length <= 0) {
			ctx.app.emit("message", DEPT_NOT_FOUND, ctx);
			return;
		}
	}

	const params = {
		name,
		parentId: parentId ? parentId : null,
		menus
	};
	ctx.department = { createParams: params };

	await next();
};

const verifyDelete = async (ctx, next) => {
	console.log("部门校验 Middleware: verifyDelete~");

	const { id } = ctx.params;

	const flag = await verifyDeptExist("wid", id, ctx);

	if (!flag) {
		return;
	}

	await next();
};

const verifyUpdate = async (ctx, next) => {
	// const { wid, name, parentId, menus } = ctx.request.body;

	// 判断当前 wid 是否存在
	// const flag = await verifyDeptExist("wid", wid, ctx);

	await next();
};

const verifyDeptAll = async (ctx, next) => {
	console.log("部门校验 Middleware: verifyDeptAll~");

	const { limitParams } = ctx.public;
	const { id, departmentName, startTime, endTime } = ctx.request.body;

	const optionalParams = filterOptionalParams({
		id,
		departmentName,
		startTime,
		endTime
	});

	const params = { ...optionalParams, ...limitParams };

	ctx.department = { getListParams: params };

	await next();
};

module.exports = {
	verifyCreate,
	verifyDelete,
	verifyUpdate,
	verifyDeptAll
};
