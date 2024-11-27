const connection = require("../app/database");

class PublicService {
	async queryDictTable(name) {
		const statement = ` SELECT wid, name FROM ${name}; `;
		try {
			const [result] = await connection.execute(statement, []);
			return result;
		} catch (error) {
			console.log(error, "查询字典表出错-db");
			return false;
		}
	}

	async queryDBExist(name) {
		const statement = `SHOW DATABASES LIKE '${name}';`;
		try {
			const [result] = await connection.execute(statement, []);
			return result;
		} catch (error) {
			console.log(error, "查询数据库出错-db");
			return false;
		}
	}

	async rolePerm(params) {
    // 一次性插入多条数据
		const placeholders = params.map(() => "(?, ?, ?, ?)").join(", ");
		const statement = `INSERT IGNORE INTO role_permissions (role_id, role_name, permission_id, permission_name) VALUES ${placeholders};`;
		// 将二维数组扁平化为一维数组
    const values = params.flat();
    try {
			const [result] = await connection.execute(statement, values);
      console.log(result);
			return result;
		} catch (error) {
			console.log(error, "关联角色权限出错-db");
			return false;
		}
	}
}

module.exports = new PublicService();
