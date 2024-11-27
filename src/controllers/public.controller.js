const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const { createToken } = require("../utils/jwt");

const { queryDictTable, rolePerm } = require("../services/public.service");

class PublicController {
	login(ctx) {
		const {
			wid,
			username,
			departmentId,
			roleId,
			isActive,
			phone,
			roleName,
			departmentName
		} = ctx.dbUserInfo;

		// 颁发 token
		const token = createToken({
			wid,
			username,
			departmentId,
			roleId,
			isActive,
			roleName,
			departmentName
		});
		if (!token) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}
		ctx.body = {
			code: 200,
			data: {
				token,
				username,
				phone
			},
			message: "登录成功~"
		};
	}

	/**
	 * @description: 根据表名查询字典表
	 * @param {*} ctx
	 */
	async getDictTable(ctx) {
		const { name } = ctx.public.dictParams;
		const result = await queryDictTable(name);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			data: result,
			tbName: name,
			message: "查询成功~"
		};
	}

	async rolePermRelevance(ctx) {
		const { rolePermParams } = ctx.public;

		const result = await rolePerm(rolePermParams);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			message: "角色权限关联成功~"
		};
	}
}

module.exports = new PublicController();