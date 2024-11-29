const connection = require("../app/database");

class DepartmentService {
	async create(params) {
		const { name, parentId } = params;
		const statement = "INSERT INTO departments(name, parent_id) VALUES(?, ?)";
		try {
			const [result] = await connection.execute(statement, [name, parentId]);
			return result;
		} catch (error) {
			console.log(error, "创建部门出错-db");
			return false;
		}
	}

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
