const { CREATE_USER_ARGUMENT_IS_NOT_EMPTY } = require("@/constant/messages");
const {
	createError,
	ACCOUNT_ALREADY_EXISTS,
	INTERNAL_PROBLEMS,
  NO_PERMISSION
} = require("../constant/error-types");
const { hashEncryption } = require("../utils/bcrypt");

const { queryUserExist } = require("../services/user.service");

/**
 * @description: 校验必填参数/用户是否已存在
 * @param {*} ctx
 * @param {*} next
 */
const verifyCreate = async (ctx, next) => {
	console.log("userMiddleware: verifyCreate~");

	const { name, password, phone, departmentId, roleId, isActive } =
		ctx.request.body;

	// 判断必传参数
	const requiredFields = [name, password, phone, departmentId, roleId];
	const flag = requiredFields.every(item => !!item === true);
	if (!flag) {
		ctx.app.emit("message", CREATE_USER_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	// 判断数据库中是否已有当前用户
	const [result] = await queryUserExist("name", name);
	if (Object.prototype.toString.call(result) === "[object Object]") {
		createError(ACCOUNT_ALREADY_EXISTS, ctx);
		return;
	}

	if (result === false) {
		createError(INTERNAL_PROBLEMS, ctx);
		return;
	}

	const params = {
		username: name,
		password: hashEncryption(password),
		phone,
		departmentId,
		roleId,
		isActive: isActive ? isActive : 1
	};

	ctx.user = { createParams: params };

	await next();
};

const verifyInfo = async (ctx, next) => {
	const { id } = ctx.params;
  const { wid } = ctx.auth.userInfo;

  // 这里之后需要查询权限，看当前用户是否有查询用户信息(query_user_info)的权限

  if (id !== wid) {
    createError(NO_PERMISSION, ctx);
    return;
  }

  await next();
};

module.exports = {
	verifyCreate,
	verifyInfo
};
