const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const {
	getMenu,
	update,
	queryMenuExist,
	create,
  remove
} = require("../services/menu.service");
const { arrayToTree } = require("../utils/format");

class MenuCoutroller {
	async createMenu(ctx) {
		const { createParams } = ctx.menu;

		const result = await create(createParams);
		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			message: "创建菜单成功~"
		};
	}

	async updateMenu(ctx) {
		const { updateParams } = ctx.menu;
		const result = await update(updateParams);
		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}
		ctx.body = {
			code: 0,
			message: "修改菜单成功~"
		};
	}

	async deleteMenu(ctx) {
		const { id } = ctx.params;
		const result = await remove(id);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			message: "删除菜单成功~"
		};
	}


  async getUserMenu(ctx) {
		const { departmentId } = ctx.auth.userInfo;
		const result = await getMenu(departmentId);
		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}
		const tree = arrayToTree(result);

		ctx.body = {
			code: 0,
			data: tree,
			message: "查询成功~"
		};
	}

	async verifyIdExist(id, message, ctx) {
		let flag = true;
		const result = await queryMenuExist(id);
		if (
			Object.prototype.toString.call(result) === "[object Array]" &&
			!result.length
		) {
			ctx.app.emit("message", message, ctx);
			flag = false;
		}

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			flag = false;
		}

		return flag;
	}
}

module.exports = new MenuCoutroller();
