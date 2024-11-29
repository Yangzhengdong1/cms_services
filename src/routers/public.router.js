const KoaRouter = require("koa-router");

const { passwordVerify, authVerify } = require("../middlewares/auth.middleware");
const { loginVerify, dictVerify, rolePermVerify, menuDeptVerify } = require("../middlewares/public.middleware");
const { login, getDictTable, rolePermRelevance, menuDeptRelevance } = require("../controllers/public.controller");

const publicRouter = new KoaRouter();


publicRouter.post("/login", loginVerify, passwordVerify, login);
publicRouter.get("/valid-token", authVerify, async ctx => (ctx.body = "token 有效~"));
publicRouter.get("/dict_table/:name", authVerify, dictVerify, getDictTable);
publicRouter.post("/role_perm_relevance", authVerify, rolePermVerify, rolePermRelevance);
publicRouter.post("/menu_dept_relevance", authVerify, menuDeptVerify, menuDeptRelevance);

module.exports = publicRouter;
