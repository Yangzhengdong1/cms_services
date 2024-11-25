const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("../middlewares/auth.middleware");
const { verifyUpdate, verifyCreate, verifyDelete } = require("../middlewares/menu.middleware");
const { getUserMenu, updateMenu, createMenu, deleteMenu, getMenuAll } = require("../controllers/menu.controller");


const menuRouter = new KoaRouter({ prefix: "/menu" });

menuRouter.post("/create", authVerify, permVerify, verifyCreate, createMenu);
menuRouter.post("/update", authVerify, permVerify, verifyUpdate, updateMenu);
menuRouter.delete("/delete/:id", authVerify, verifyDelete, deleteMenu);
menuRouter.get("/get-user-menu", authVerify, getUserMenu);
menuRouter.get("/get-menus", authVerify, getMenuAll);

module.exports = menuRouter;
