const KoaRouter = require("koa-router");

const { verifyCreate, permOperationVerify } = require("../middlewares/perm.middleware");
const { createPerm } = require("../controllers/perm.controller");
const { authVerify } = require("../middlewares/auth.middleware");

const permRouter = new KoaRouter({ prefix: "/permission" });

permRouter.post("/create", authVerify, permOperationVerify, verifyCreate, createPerm);

module.exports = permRouter;
