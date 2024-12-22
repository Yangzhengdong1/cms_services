const { STORY_ARGUMENT_IS_NOT_EMPTY } = require("@/constant/messages");

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

module.exports = {
	verifyCreate
};
