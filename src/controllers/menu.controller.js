const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const {
	getMenu,
	update,
	queryMenuExist,
	create,
	remove,
	getMenuList
} = require("../services/menu.service");
const { queryDictTable } = require("../services/public.service");
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

	/**
	 * @description: 查询用户所属部门的菜单树
	 * @param {*} ctx
	 */
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

	/**
	 * @description: 分页查询菜单列表
	 * @param {*} ctx
	 */
	async getMenuAll(ctx) {
		const result = await getMenuList(ctx.menu.getListParams);
		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			total: result.length,
			data: result,
			message: "查询成功~"
		};
	}

	async getMenuTree(ctx) {
		let result = await queryDictTable("menus", [
			"name",
			"wid",
      "icon",
      "url",
      "DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') AS createTime",
      " DATE_FORMAT(updateAt, '%Y-%m-%d %H:%i:%s') AS updateTime",
			"parent_id AS parentId"
		]);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		result = arrayToTree(result);

		ctx.body = {
			code: 0,
			list: result,
			message: "查询成功~"
		};
	}

	/**
	 * @description: 根据 id 查询当前菜单是否存在
	 * @param {*} id
	 * @param {*} message
	 * @param {*} ctx
	 */
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
