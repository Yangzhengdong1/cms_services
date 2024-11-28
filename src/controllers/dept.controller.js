const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");
const { create } = require("../services/dept.service");

class DepartmentService {
  async createDepartment(ctx) {
    const { createParams } = ctx.department;
    const result = await create(createParams);

    if (!result) {
      createError(INTERNAL_PROBLEMS, ctx);
      return;
    }

    ctx.body = {
      code: 0,
      message: "创建部门成功~"
    };
  }
}

module.exports = new DepartmentService();
