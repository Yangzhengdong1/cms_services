const KoaRouter = require("koa-router");

const { passwordVerify, authVerify } = require("../middlewares/auth.middleware");
const { loginVerify, dictVerify } = require("../middlewares/public.middleware");
const { login, getDictTable } = require("../controllers/pubilc.controller");

const publicRouter = new KoaRouter();


publicRouter.post("/login", loginVerify, passwordVerify, login);
publicRouter.get("/valid-token", authVerify, async ctx => (ctx.body = "token 有效~"));
publicRouter.get("/dict_table/:name", authVerify, dictVerify, getDictTable);

module.exports = publicRouter;
