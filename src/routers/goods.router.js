const KoaRouter = require("koa-router");

const { authVerify } = require("../middlewares/auth.middleware");
const { limitVerify } = require("../middlewares/public.middleware");
const { verifyGoodsAll } = require("../middlewares/goods.middleware");
const { getGoodsAll } = require("../controllers/goods.controller");

const goodsRouter = new KoaRouter({prefix: "/goods"});

goodsRouter.post("/get-list", authVerify, limitVerify, verifyGoodsAll, getGoodsAll);

module.exports = goodsRouter;
