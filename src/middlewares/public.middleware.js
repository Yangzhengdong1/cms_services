const {
	createError,
	USER_NOT_FOUND,
	INTERNAL_PROBLEMS
} = require("../constant/error-types");
const {
	LOGIN_ARGUMENT_IS_NOT_EMPTY,
	DICT_TABLE_NOT_FOUND,
	ROLE_PERM_ARGUMENT_IS_NOT_EMPTY,
	ROLE_NOT_FOUND
} = require("../constant/messages");
const dictTableMap = require("../constant/dict_table");

const { queryUserExist } = require("../services/user.service");
const { queryRole } = require("../services/role.service");

/**
 * @description: 处理登录参数（不允许重名/必填参数：name、password）
 * @param {*} ctx
 * @param {*} next
 */
const loginVerify = async (ctx, next) => {
	console.log("登录校验 Middleware: loginVerify~");

	const { username, password } = ctx.request.body;
	if (!username || !password) {
		ctx.app.emit("message", LOGIN_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	// 判断用户是否存在
	const [result] = await queryUserExist("name", username);
	if (!result) {
		createError(USER_NOT_FOUND, ctx);
		return;
	}

	ctx.dbUserInfo = result;

	await next();
};

/**
 * @description: 处理字典表查询参数（必填参数：name）
 * @param {*} ctx
 * @param {*} next
 */
const dictVerify = async (ctx, next) => {
	console.log("字典表校验 Middleware: dictVerify~");

	const { name } = ctx.params;
	const dictTableName = dictTableMap[name];

	if (!dictTableName) {
		ctx.app.emit("message", DICT_TABLE_NOT_FOUND, ctx);
		return;
	}

	ctx.public = { dictParams: { name: dictTableName } };

	await next();
};

const rolePermVerify = async (ctx, next) => {
	console.log("角色权限关联校验 Middleware: rolePermVerify~");

	const { roleId, permissions } = ctx.request.body;
	if (!roleId || !permissions?.length) {
		ctx.app.emit("message", ROLE_PERM_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	const result = await queryRole("wid", roleId);

	if (result === false) {
		createError(INTERNAL_PROBLEMS, ctx);
		return;
	}

	if (!result.length) {
		ctx.app.emit("message", ROLE_NOT_FOUND, ctx);
		return;
	}

	const params = {
		roleId,
		roleName: result[0].name,
		permissions
	};

	// const params = permissions.map(item => {
	//   const roleName = result[0].name, permissionName = item.name, permissionId = item.wid;
	// 	return [roleId, roleName, permissionId, permissionName];
	// });

	ctx.public = { rolePermParams: params };

	await next();
};

module.exports = {
	loginVerify,
	dictVerify,
	rolePermVerify
};
