const KoaRouter = require("koa-router");

const { SERVICE_NAME } = require("@/app/config");

const templateRouter = new KoaRouter({prefix: "/"});

templateRouter.get("", async ctx => {
  await ctx.render("index", {
    appName: SERVICE_NAME
  });
});

module.exports = templateRouter;
