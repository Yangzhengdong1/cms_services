const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("@/middlewares/auth.middleware");
const { limitVerify } = require("../middlewares/public.middleware");
const { verifyCreate, verifyInfo, verifyUserAll, verifyDelete, verifyUpdate } = require("@/middlewares/user.middleware");
const { createUser, getUserInfo, getUserAll, deleteUser, updateUser } = require("@/controllers/user.controller");

const userRouter = new KoaRouter({prefix: "/user"});

userRouter.post("/create",authVerify, permVerify, verifyCreate, createUser);
userRouter.delete("/delete/:id", authVerify, permVerify, verifyDelete, deleteUser);
userRouter.post("/update", authVerify, permVerify, verifyUpdate, updateUser);
userRouter.get("/info/:id", authVerify, verifyInfo, getUserInfo);
userRouter.post("/get-list", authVerify, limitVerify, verifyUserAll, getUserAll);

module.exports = userRouter;
