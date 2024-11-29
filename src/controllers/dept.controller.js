const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const { create, queryDepartment } = require("../services/dept.service");
const { menuDept } = require("../services/public.service");

class DepartmentService {
	async createDepartment(ctx) {
		const { name, parentId, menus } = ctx.department.createParams;

		const result = await create({ name, parentId });

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		if (menus.length > 0) {
      console.log("部门菜单关联-create");
			// 查询刚创建的部门信息
			const department = await queryDepartment("name", name);
			if (!department) {
				createError(INTERNAL_PROBLEMS, ctx);
				return;
			}
			const { wid: departmentId, name: departmentName } = department[0];

			const params = {
				departmentId,
				departmentName,
				menus
			};
			// 关联部门菜单
			const res = await menuDept(params);
			if (!res) {
				createError(INTERNAL_PROBLEMS, ctx);
				return;
			}
		}

		ctx.body = {
			code: 0,
			message: "创建部门成功~"
		};
	}
}

module.exports = new DepartmentService();
