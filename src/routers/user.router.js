const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("@/middlewares/auth.middleware");
const { limitVerify } = require("../middlewares/public.middleware");
const { verifyCreate, verifyInfo, verifyUserAll } = require("@/middlewares/user.middleware");
const { createUser, getUserInfo, getUserAll } = require("@/controllers/user.controller");

const userRouter = new KoaRouter({prefix: "/user"});

userRouter.post("/create",authVerify, permVerify, verifyCreate, createUser);
userRouter.delete("/delete/:id", authVerify);
userRouter.get("/info/:id", authVerify, verifyInfo, getUserInfo);
userRouter.get("/get-list", authVerify, limitVerify, verifyUserAll, getUserAll);

module.exports = userRouter;
