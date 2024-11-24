const KoaRouter = require("koa-router");

const deptRouter = new KoaRouter({prefix: "department"});

deptRouter.get();

export default deptRouter();
