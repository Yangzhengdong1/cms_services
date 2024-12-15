const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const { getGoodsList } = require("../services/goods.service");

class GoodsController {
	async getGoodsAll(ctx) {
		const { getListParams } = ctx.goods;
		const { result, total, status } = await getGoodsList(getListParams);

		if (status) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			totalCount: total,
			list: result,
			message: "查询成功~"
		};
	}
}

module.exports = new GoodsController();
