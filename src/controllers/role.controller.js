const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const { rolePerm } = require("../services/public.service");
const { create, queryRole } = require("../services/role.service");

class RoleController {
	async createRole(ctx) {
		const { name, departmentId, description, permissions } =
			ctx.role.createParams;
		const result = await create({ name, departmentId, description });

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		if (permissions.length > 0) {
      console.log("角色权限关联-create");
      // 查询角色信息
      const role = await queryRole("name", name);
      if (!role) {
        createError(INTERNAL_PROBLEMS, ctx);
        return;
      }
      const { wid: roleId, name: roleName } = role[0];
      // 关联权限
      const params = {
        roleId,
        roleName,
        permissions
      };

      const res = await rolePerm(params);
      if (!res) {
        createError(INTERNAL_PROBLEMS, ctx);
        return;
      }
		}

		ctx.body = {
			code: 0,
			message: "角色创建成功~"
		};
	}
}

module.exports = new RoleController();
