const KoaRouter = require("koa-router");

const { verifyCreate } = require("../middlewares/perm.middleware");
const { createPerm } = require("../controllers/perm.controller");

const permRouter = new KoaRouter({ prefix: "/permission" });

permRouter.post("/create", verifyCreate, createPerm);

module.exports = permRouter;
