const { filterOptionalParams } = require("../utils/format");

const verifyGoodsAll = async (ctx, next) => {
	console.log("商品校验 Middleware: verifyGoodsAll~");
	const { limitParams } = ctx.public;
	const { title, description, startTime, endTime } = ctx.request.body;
	const optionalParams = filterOptionalParams({
		title,
		description,
		startTime,
		endTime
	});

  const params = { ...limitParams, ...optionalParams };

  ctx.goods = { getListParams: params };

	await next();
};

module.exports = {
	verifyGoodsAll
};
