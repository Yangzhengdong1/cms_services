const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");

const { create } = require("../services/story.service");

class StoryController {
	async createStory(ctx) {
		const { createParams } = ctx.story;

		const result = await create(createParams);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			message: "创建成功~"
		};
	}
}

module.exports = new StoryController();
