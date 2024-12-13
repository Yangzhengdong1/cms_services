const {
	DEPT_CREATE_ARGUMENT_IS_NOT_EMPTY,
	DEPT_NAME_IS_EXIST,
	DEPT_NOT_FOUND,
	DEPT_CREATE_ARGUMENT_TYPE_ERROR,
	DEPT_WID_IS_NOT_EMPTY
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

/**
 * @description: 处理部门创建/更新参数
 * @param {*} ctx
 * @param {*} wid 更新用户时用到
 * @return {*} { isValid, params }
 */
const validateCondition = async (ctx, wid = "") => {
	if (wid) {
		const widExistFlag = await verifyDeptExist("wid", wid, ctx);
		if (!widExistFlag) {
			return { isValid: false };
		}
	}
	const { name, parentId, menus } = ctx.request.body;

	// 判断必传参数
	if (!name) {
		ctx.app.emit("message", DEPT_CREATE_ARGUMENT_IS_NOT_EMPTY, ctx);
		return { isValid: false };
	}

	// 判断menus字段类型
	if (!Array.isArray(menus)) {
		ctx.app.emit("message", DEPT_CREATE_ARGUMENT_TYPE_ERROR, ctx);
		return { isValid: false };
	}

	// 名称唯一性校验
	const result = await queryDepartment("name", name);
	if (Array.isArray(result) && result.length > 0) {
		// 更新时需要排除自身
		if (!wid || wid !== result[0].wid) {
      ctx.app.emit("message", DEPT_NAME_IS_EXIST, ctx);
			return { isValid: false };
		}
	}

	// 判断 parentId 是否存在
	if (parentId) {
		const parentIdExist = await verifyDeptExist("wid", parentId, ctx);
		if (!parentIdExist) {
			return { isValid: false };
		}
	}

	const params = {
		name,
		parentId: parentId ? parentId : null,
		menus,
		...(wid && { wid })
	};

	return { isValid: true, params };
};

const verifyCreate = async (ctx, next) => {
	console.log("部门校验 Middleware: verifyCreate~");

	const { isValid, params } = await validateCondition(ctx);

	if (!isValid) {
		return;
	}

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
	console.log("部门校验 Middleware: verifyUpdate~");

	const { wid } = ctx.request.body;
	if (!wid) {
		ctx.app.emit("message", DEPT_WID_IS_NOT_EMPTY, ctx);
		return;
	}

	const { isValid, params } = await validateCondition(ctx, wid);
	if (!isValid) {
		return;
	}

	ctx.department = { updateParams: params };

	await next();
};

const verifyDeptAll = async (ctx, next) => {
	console.log("部门校验 Middleware: verifyDeptAll~");

	const { limitParams } = ctx.public;
	const { id, parentId, departmentName, startTime, endTime } = ctx.request.body;

	const optionalParams = filterOptionalParams({
		id,
		parentId,
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
