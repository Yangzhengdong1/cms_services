const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("../middlewares/auth.middleware");
const { limitVerify } = require("../middlewares/public.middleware");
const { verifyUpdate, verifyCreate, verifyDelete, verifyMenuAll } = require("../middlewares/menu.middleware");
const { getUserMenu, updateMenu, createMenu, deleteMenu, getMenuAll } = require("../controllers/menu.controller");


const menuRouter = new KoaRouter({ prefix: "/menu" });

menuRouter.post("/create", authVerify, permVerify, verifyCreate, createMenu);
menuRouter.delete("/delete/:id", authVerify, permVerify, verifyDelete, deleteMenu);
menuRouter.post("/update", authVerify, permVerify, verifyUpdate, updateMenu);
menuRouter.get("/get-user-menu", authVerify, getUserMenu);
menuRouter.get("/get-menu-list", authVerify, limitVerify, verifyMenuAll, getMenuAll);

module.exports = menuRouter;
