const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("../middlewares/auth.middleware");
const { verifyCreate, verifyDelete, verifyDeptAll } = require("../middlewares/dept.middleware");
const { createDepartment, deleteDepartment, getDeptAll } = require("../controllers/dept.controller");
const { limitVerify } = require("../middlewares/public.middleware");

const deptRouter = new KoaRouter({prefix: "/department"});

deptRouter.post("/create", authVerify, permVerify, verifyCreate, createDepartment);
deptRouter.delete("/delete/:id", authVerify, permVerify, verifyDelete, deleteDepartment);
// deptRouter.post("/update", authVerify, permVerify, verifyUpdate);
deptRouter.post("/get-list", authVerify, permVerify, limitVerify, verifyDeptAll, getDeptAll);

module.exports = deptRouter;
