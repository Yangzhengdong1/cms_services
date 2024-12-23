const KoaRouter = require("koa-router");
const { authVerify } = require("../middlewares/auth.middleware");
const { verifyCreate, verifyStoryAll } = require("../middlewares/story.middleware");
const { createStory, getStoryAll } = require("../controllers/story.controller");
const { limitVerify } = require("../middlewares/public.middleware");

const storyRouter = new KoaRouter({prefix: "/story"});

storyRouter.post("/create", authVerify, verifyCreate, createStory);
storyRouter.post("/get-list", limitVerify, verifyStoryAll, getStoryAll);

module.exports = storyRouter;
