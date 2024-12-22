const { create, remove, update, getPermossionList } = require("../services/perm.service");

const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");

class PermissionCoutroller {
	async createPerm(ctx) {
		const { createParams } = ctx.perm;
		const result = await create(createParams);
		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}
		ctx.body = {
			code: 0,
			message: "权限创建成功~"
		};
	}

	async deletePerm(ctx) {
		const { id } = ctx.params;

		const result = await remove(id);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			message: "删除权限成功~"
		};
	}

	async updatePerm(ctx) {
		const { updateParams } = ctx.perm;

		const result = await update(updateParams);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			message: "修改权限成功~"
		};
	}

	async getPermAll(ctx) {
		const { getListParams } = ctx.perm;

		const { result, total, status } = await getPermossionList(getListParams);

		if (status) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			totalCount: total,
			pageSize: result.length,
			list: result,
			message: "查询成功~"
		};
	}
}

module.exports = new PermissionCoutroller();
