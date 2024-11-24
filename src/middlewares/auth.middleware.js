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
	ctx.auth = { userInfo: result };
	await next();
};

/**
 * @description: 判断当前角色是否拥有操作权限
 * @param {*} ctx
 * @param {*} next
 */
const permVerify = async (ctx, next) => {
  console.log("权限校验 middleware: permVerify");
	const { roleId } = ctx.auth.userInfo;
  const { url } = ctx.request;
  const result = await queryRolePermission(roleId);

  if (!result) {
    createError(INTERNAL_PROBLEMS, ctx);
    return;
  }

  if (!comparePerm(result, url)) {
    createError(NO_PERMISSION, ctx);
    return;
  }

	await next();
};

const passwordVerify = async (ctx, next) => {
	console.log("loginMiddleware: passwordVerify~");

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
