const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("@/middlewares/auth.middleware");
const { verifyCreate, verifyInfo } = require("@/middlewares/user.middleware");
const { createUser, getUserInfo } = require("@/controllers/user.controller");

const userRouter = new KoaRouter({prefix: "/user"});

userRouter.post("/create",authVerify, permVerify, verifyCreate, createUser);
userRouter.delete("/delete/:id", authVerify);
userRouter.get("/info/:id", authVerify, verifyInfo, getUserInfo);

module.exports = userRouter;
