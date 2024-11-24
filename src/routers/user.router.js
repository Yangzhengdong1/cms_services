const KoaRouter = require("koa-router");

const { verifyCreate, verifyInfo } = require("@/middlewares/user.middleware");
const { authVerify } = require("../middlewares/auth.middleware");
const { createUser, getUserInfo } = require("../controllers/user.controller");

const userRouter = new KoaRouter({prefix: "/user"});

userRouter.post("/create", verifyCreate, createUser);
userRouter.get("/info/:id", authVerify, verifyInfo, getUserInfo);

module.exports = userRouter;
