const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");

const { create, queryUserExist, getUserList } = require("../services/user.service");

class UserController {
	async createUser(ctx) {
		const result = await create(ctx.user.createParams);
		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}
		ctx.body = {
			code: 0,
			message: "创建用户成功~"
		};
	}

	async getUserInfo(ctx) {
		const { id } = ctx.params;
		const result = await queryUserExist("wid", id);
		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		const {
			wid,
			username,
			phone,
			roleId,
			departmentId,
			createTime,
			updateTime,
			roleName,
			departmentName,
			avatarUrl
		} = result[0];

		ctx.body = {
			code: 0,
			data: {
				username,
				roleName,
				departmentName,
				wid,
				roleId,
				departmentId,
				phone,
				avatarUrl,
				createTime,
				updateTime
			},
			message: "查询成功~"
		};
	}

	async getUserAll(ctx) {
		const { getListParams } = ctx.user;
		const { total, result, status } = await getUserList(getListParams);
		if (status) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

    result.forEach(item => (item.isActive = !!item.isActive));

		ctx.body = {
			code: 0,
      totalCount: total,
			pageNum: result.length,
			list: result,
			message: "查询成功~"
		};
	}
}

module.exports = new UserController();
