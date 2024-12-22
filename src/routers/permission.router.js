const KoaRouter = require("koa-router");

const { verifyCreate, permOperationVerify, verifyDelete, verifyUpdate, verifyPermAll } = require("../middlewares/perm.middleware");
const { createPerm, deletePerm, updatePerm, getPermAll } = require("../controllers/perm.controller");
const { authVerify, permVerify } = require("../middlewares/auth.middleware");
const { limitVerify } = require("../middlewares/public.middleware");

const permRouter = new KoaRouter({ prefix: "/permission" });

permRouter.post("/create", authVerify, permOperationVerify, verifyCreate, createPerm);
permRouter.delete("/delete/:id", authVerify, permVerify, verifyDelete, deletePerm);
permRouter.post("/update", authVerify, permVerify, verifyUpdate, updatePerm);
permRouter.post("/get-list", authVerify, limitVerify, verifyPermAll, getPermAll);

module.exports = permRouter;
