const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("../middlewares/auth.middleware");
const { verifyCreate } = require("../middlewares/role.middleware");
const { createRole } = require("../controllers/role.controller");

const roleRouter = new KoaRouter({prefix: "/role"});

roleRouter.post("/create", authVerify, permVerify, verifyCreate, createRole);

module.exports = roleRouter;
