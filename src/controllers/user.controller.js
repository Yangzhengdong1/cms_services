const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");

const {
	create,
	remove,
	update,
	queryUserExist,
	getUserList
} = require("../services/user.service");

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

	async deleteUser(ctx) {
		const { id } = ctx.params;

		const result = await remove(id);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			message: "删除成功~"
		};
	}

	async updateUser(ctx) {
		const { updateParams } = ctx.user;

		const result = await update(updateParams);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			message: "修改成功~"
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
			realname,
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
				realname,
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
			pageSize: result.length,
			list: result,
			message: "查询成功~"
		};
	}
}

module.exports = new UserController();
