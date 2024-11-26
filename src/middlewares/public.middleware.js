const {
	createError,
	USER_NOT_FOUND
} = require("../constant/error-types");
const { LOGIN_ARGUMENT_IS_NOT_EMPTY, DICT_TABLE_NOT_FOUND } = require("../constant/messages");
const dictTableMap = require("../constant/dict_table");

const { queryUserExist } = require("../services/user.service");

/**
 * @description: 处理登录参数（不允许重名/必填参数：name、password）
 * @param {*} ctx
 * @param {*} next
 */
const loginVerify = async (ctx, next) => {
	console.log("loginMiddleware: loginVerify~");

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
	const { name } = ctx.params;
  const dictTableName = dictTableMap[name];

  if (!dictTableName) {
    ctx.app.emit("message", DICT_TABLE_NOT_FOUND, ctx);
    return;
  }

	await next();
};

module.exports = {
	loginVerify,
	dictVerify
};
