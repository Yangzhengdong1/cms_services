const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const {
	create,
	queryDepartment,
	remove,
	getDepartmentList,
	update
} = require("../services/dept.service");
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

	async deleteDepartment(ctx) {
		const { id } = ctx.params;
		const result = await remove(id);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		ctx.body = {
			code: 0,
			message: "删除部门成功~"
		};
	}

	async updateDepartment(ctx) {
		const {
			wid: departmentId,
			name: departmentName,
			menus
		} = ctx.department.updateParams;

		const result = await update(ctx.department.updateParams);

		if (!result) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

		// 更新部门菜单
		if (menus && menus.length > 0) {
			console.log("部门菜单关联-update");
			const res = await menuDept({ departmentId, departmentName, menus });
			if (!res) {
				createError(INTERNAL_PROBLEMS, ctx);
				return;
			}
		}

		ctx.body = {
			code: 0,
			message: "修改成功~"
		};
	}

	async getDeptAll(ctx) {
		const { getListParams } = ctx.department;
		let { result, total, status } = await getDepartmentList(getListParams);

		if (status) {
			createError(INTERNAL_PROBLEMS, ctx);
			return;
		}

    result = result.map(dept => {
      dept.menus = dept.menus.filter(menu => menu.wid !== null);
      return dept;
    });

		ctx.body = {
			code: 0,
			totalCount: total,
			pageSize: result.length,
			list: result,
			message: "查询成功~"
		};
	}
}

module.exports = new DepartmentService();
