const KoaRouter = require("koa-router");
const { authVerify } = require("../middlewares/auth.middleware");
const { verifyCreate } = require("../middlewares/story.middleware");
const { createStory } = require("../controllers/story.controller");

const storyRouter = new KoaRouter({prefix: "/story"});

storyRouter.post("/create", authVerify, verifyCreate, createStory);

module.exports = storyRouter;
