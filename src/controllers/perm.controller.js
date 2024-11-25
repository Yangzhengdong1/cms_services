const { create } = require("../services/perm.service");

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
}

module.exports = new PermissionCoutroller();
