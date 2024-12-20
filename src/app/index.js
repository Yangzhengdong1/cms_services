const path = require("path");

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const koaViews = require("koa-views");
const KoaStatic = require("koa-static");
const mount = require("koa-mount");

require("./database");
require("module-alias/register");

const { handleError } = require("@/app/error-handle");
const handleMessage = require("@/app/message-handle");
const { VIEWS_PATH } = require("@/app/config");
const { globalLogger } = require("@/utils/log4js");

// 导入路由
const templateRouter = require("@/routers/template");
const userRouter = require("@/routers/user.router");
const publicRouter = require("@/routers/public.router");
const menuRouter = require("@/routers/menu.router");
const permRouter = require("@/routers/permission.router");
const deptRouter = require("@/routers/department.router");
const roleRouter = require("@/routers/role.router");
const uploadRouter = require("@/routers/upload.router");
const goodsRouter = require("@/routers/goods.router");

const app = new Koa();

// 注册其他中间件
app.use(koaViews(VIEWS_PATH, { extension: "ejs" }));
app.use(bodyParser());
app.use(globalLogger());
// 开启静态资源服务，提供 uploads 文件夹的访问
// mount: 提供静态服务访问前缀， koa-static prefix属性被废弃
app.use(mount("/uploads/imgs/", KoaStatic(path.resolve(__dirname, "../../uploads/imgs/"), { maxage: 2592000000 }))); //静态资源30天缓存 实际上 = 2592000秒

// 注册路由
app.use(templateRouter.routes());
app.use(templateRouter.allowedMethods());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());
app.use(menuRouter.routes());
app.use(menuRouter.allowedMethods());
app.use(permRouter.routes());
app.use(permRouter.allowedMethods());
app.use(deptRouter.routes());
app.use(deptRouter.allowedMethods());
app.use(roleRouter.routes());
app.use(roleRouter.allowedMethods());
app.use(uploadRouter.routes());
app.use(uploadRouter.allowedMethods());
app.use(goodsRouter.routes());
app.use(goodsRouter.allowedMethods());

app.on("error", handleError);
app.on("message", handleMessage);

module.exports = app;
