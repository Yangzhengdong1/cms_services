const { STORY_ARGUMENT_IS_NOT_EMPTY } = require("@/constant/messages");
const { filterOptionalParams } = require("../utils/format");

const verifyCreate = async (ctx, next) => {
	const { wid } = ctx.auth.userInfo;
	let { content, utterer } = ctx.request.body;

	if (!content) {
		ctx.app.emit("message", STORY_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	utterer = utterer ? utterer : "匿名";

	const params = {
		userId: wid,
		utterer,
		content
	};
	ctx.story = { createParams: params };

	await next();
};

const verifyStoryAll = async (ctx, next) => {
	const { limitParams } = ctx.public;
  const { content, utterer, startTime, endTime } = ctx.request.body;
  const optionalParams = filterOptionalParams({
    content, utterer, startTime, endTime
  });

  const params = { ...optionalParams, ...limitParams };
  ctx.story = { getListParams: params };

	await next();
};

module.exports = {
	verifyCreate,
	verifyStoryAll
};
