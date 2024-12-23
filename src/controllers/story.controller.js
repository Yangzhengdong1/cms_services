const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");

const { create, getStoryList } = require("../services/story.service");
const { timeAgoFormat } = require("../utils/dayjs");

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

	async getStoryAll(ctx) {
		const { getListParams } = ctx.story;

		const { result, total, status } = await getStoryList(getListParams);

		if (status) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		// 转化时间
		const storys = result.map(item => {
			const timeAgo = timeAgoFormat(new Date(item.createTime));
      item.timeAgo = timeAgo;
      return item;
		});

		ctx.body = {
			code: 0,
			totalCount: total,
			lsit: storys,
			message: "查询成功~"
		};
	}
}

module.exports = new StoryController();
