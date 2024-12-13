const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("../middlewares/auth.middleware");
const { limitVerify } = require("../middlewares/public.middleware");
const { verifyCreate, verifyRoleAll, verifyDelete } = require("../middlewares/role.middleware");
const { createRole, getPermossionList, getRoleAll, getRoleDetail, deleteRole } = require("../controllers/role.controller");

const roleRouter = new KoaRouter({prefix: "/role"});

roleRouter.post("/create", authVerify, permVerify, verifyCreate, createRole);
roleRouter.get("/get-permission-list", authVerify, getPermossionList);
roleRouter.post("/get-list", authVerify, limitVerify, verifyRoleAll, getRoleAll);
roleRouter.get("/detail/:id", authVerify, permVerify, getRoleDetail);
roleRouter.delete("/delete/:id", authVerify, permVerify, verifyDelete, deleteRole);

module.exports = roleRouter;
