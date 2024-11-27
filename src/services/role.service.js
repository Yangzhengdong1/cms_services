const connection = require("../app/database");

class RoleService {
	async queryRole(fieldKey, fieldValue) {
		const statement = `SELECT * FROM roles WHERE ${fieldKey} = ?;`;

		try {
			const [result] = await connection.execute(statement, [ fieldValue ]);
			return result;
		} catch (error) {
			console.log(error, "查询角色信息出错-db");
			return false;
		}
	}
}

module.exports = new RoleService();
