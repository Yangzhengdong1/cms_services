const KoaRouter = require("koa-router");

const { queryUserExist } = require("../services/user.service");
const { passwordVerify, authVerify } = require("../middlewares/auth.middleware");

const { LOGIN_ARGUMENT_IS_NOT_EMPTY } = require("../constant/messages");
const { createError, USER_NOT_FOUND, INTERNAL_PROBLEMS } = require("../constant/error-types");
const { createToken } = require("../utils/jwt");

const loginRouter = new KoaRouter();

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

const login = ctx => {
	const {
		wid,
		username,
		departmentId,
		roleId,
		isActive,
    phone
	} = ctx.dbUserInfo;

  // 颁发 token
	const token = createToken({ wid, username, departmentId, roleId, isActive });
	if (!token) {
    createError(INTERNAL_PROBLEMS, ctx);
    return;
  }
  ctx.body = {
		code: 200,
    data: {
      token,
      username,
      phone
    },
		message: "登录成功~"
	};
};

loginRouter.post("/login", loginVerify, passwordVerify, login);
loginRouter.get("/valid-token", authVerify, async ctx => (ctx.body = "token 有效~"));

module.exports = loginRouter;
