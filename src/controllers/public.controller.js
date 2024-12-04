const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const { createToken } = require("../utils/jwt");

const {
	queryDictTable,
	rolePerm,
	menuDept
} = require("../services/public.service");

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

		const payload = {
			wid,
			username,
			departmentId,
			roleId,
			isActive,
			roleName,
			departmentName
		};
		const options = {
			expiresIn: 60 * 60 * 24 * 30,
			algorithm: "RS256"
		};
		// 颁发 token
		const token = createToken(payload, options);
		if (!token) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}
		ctx.body = {
			code: 0,
			data: {
				id: wid,
				username,
				phone,
				token
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

	async menuDeptRelevance(ctx) {
		const { menuDeptParams } = ctx.public;

		const result = await menuDept(menuDeptParams);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			message: "部门菜单关联成功~"
		};
	}
}

module.exports = new PublicController();
