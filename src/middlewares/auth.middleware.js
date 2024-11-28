const jwt = require("../utils/jwt");
const { hashCompare } = require("../utils/bcrypt");

const {
	createError,
	UNAUTHORIZED,
	ERROR_INCORRECT_USERNAME_OR_PASSWORD,
  INTERNAL_PROBLEMS,
  NO_PERMISSION
} = require("../constant/error-types");
const { comparePerm } = require("../constant/permission");

const { queryRolePermission } = require("../services/auth.service");


/**
 * @description: 校验 token
 * @param {*} ctx
 * @param {*} next
 */
const authVerify = async (ctx, next) => {
	console.log("权限校验 Middleware：authVerify~");

  // 获取当前操作权限名称
  const { url } = ctx.request;
  const permName = url.split("/").splice(1, 2).join("_");

	const { authorization } = ctx.headers;
	if (!authorization) {
		createError(UNAUTHORIZED, ctx);
		return;
	}
	const token = authorization.replace("Bearer ", "");
	const result = jwt.verifyToken(token);

	if (!result) {
		createError(UNAUTHORIZED, ctx);
		return;
	}
	console.log("解密后的用户信息：", result);
	ctx.auth = { userInfo: {...result, permName} };
	await next();
};

/**
 * @description: 判断当前角色是否拥有操作权限
 * @param {*} ctx
 * @param {*} next
 */
const permVerify = async (ctx, next) => {
  console.log("权限校验 Middleware: permVerify");

	const { roleId, permName } = ctx.auth.userInfo;
  const result = await queryRolePermission(roleId);

  if (!result) {
    createError(INTERNAL_PROBLEMS, ctx);
    return;
  }

  console.log(result, permName);
  if (!comparePerm(result, permName)) {
    createError(NO_PERMISSION, ctx);
    return;
  }

	await next();
};

/**
 * @description: 校验密码是否与数据库中保存的相匹配
 * @param {*} ctx
 * @param {*} next
 */
const passwordVerify = async (ctx, next) => {
	console.log("权限校验 Middleware: passwordVerify~");

	const { username, password } = ctx.request.body;
	const { username: name, password: pwd } = ctx.dbUserInfo;

	const compareResult = hashCompare(password, pwd);
	if (username !== name || !compareResult) {
		createError(ERROR_INCORRECT_USERNAME_OR_PASSWORD, ctx);
		return;
	}

	await next();
};

module.exports = {
	authVerify,
	passwordVerify,
  permVerify
};
