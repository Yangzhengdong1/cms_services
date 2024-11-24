const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("../middlewares/auth.middleware");
const { verifyUpdate, verifyCreate } = require("../middlewares/menu.middleware");
const { getUserMenu, updateMenu, createMenu } = require("../controllers/menu.controller");


const menuRouter = new KoaRouter({ prefix: "/menu" });

menuRouter.post("/create", authVerify, permVerify, verifyCreate, createMenu);
menuRouter.get("/get-user-menu", authVerify, getUserMenu);
menuRouter.post("/update", authVerify, permVerify, verifyUpdate, updateMenu);

module.exports = menuRouter;
