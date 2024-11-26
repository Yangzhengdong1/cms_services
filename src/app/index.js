const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const koaViews = require("koa-views");

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

const app = new Koa();

// 注册其他中间件
app.use(koaViews(VIEWS_PATH, { extension: "ejs" }));
app.use(bodyParser());
app.use(globalLogger());

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

app.on("error", handleError);
app.on("message", handleMessage);

module.exports = app;
