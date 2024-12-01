const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("../middlewares/auth.middleware");
const { verifyCreate } = require("../middlewares/dept.middleware");
const { createDepartment } = require("../controllers/dept.controller");

const deptRouter = new KoaRouter({prefix: "/department"});

deptRouter.post("/create", authVerify, permVerify, verifyCreate, createDepartment);

module.exports = deptRouter;
