const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("../middlewares/auth.middleware");
const { limitVerify } = require("../middlewares/public.middleware");
const { verifyCreate, verifyRoleAll, verifyDelete, verifyUpdate, verifyDetail } = require("../middlewares/role.middleware");
const { createRole, getPermossionList, getRoleAll, getRoleDetail, deleteRole, updateRole } = require("../controllers/role.controller");

const roleRouter = new KoaRouter({prefix: "/role"});

roleRouter.post("/create", authVerify, permVerify, verifyCreate, createRole);
roleRouter.delete("/delete/:id", authVerify, permVerify, verifyDelete, deleteRole);
roleRouter.post("/update", authVerify, permVerify, verifyUpdate, updateRole);
roleRouter.get("/get-permission-list", authVerify, getPermossionList);
roleRouter.post("/get-list", authVerify, limitVerify, verifyRoleAll, getRoleAll);
roleRouter.get("/detail/:id", authVerify, permVerify, verifyDetail, getRoleDetail);

module.exports = roleRouter;
