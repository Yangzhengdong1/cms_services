const connection = require("../app/database");

class DepartmentService {
	async queryDepartment(fliedKey, fliedValue) {
		const statement = `SELECT * FROM departments WHERE ${fliedKey} = ?`;

		try {
			const [result] = await connection.execute(statement, [fliedValue]);
			return result;
		} catch (error) {
			console.log(error, "查询部门信息失败-db");
			return false;
		}
	}
}

module.exports = new DepartmentService();
