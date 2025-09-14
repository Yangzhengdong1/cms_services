const connection = require("../app/database");

class AuthClass {
	async queryRolePermission(roleId) {
		const statement = `
      SELECT p.name, p.description 
      FROM permissions AS p 
      JOIN role_permissions rp 
      ON p.wid = rp.permission_id 
      WHERE rp.role_id = ?  ORDER BY p.name ASC;
    `;
		try {
			const [result] = await connection.execute(statement, [roleId]);
			return result;
		} catch (error) {
			console.log(error, "查询角色权限出错-db");
			return false;
		}
	}

	async queryAllPermission() {
		const statement = `
      SELECT p.name, p.description 
      FROM permissions AS p 
      JOIN role_permissions rp 
      ON p.wid = rp.permission_id ORDER BY p.name ASC;
    `;
		try {
			const [result] = await connection.execute(statement);
			return result;
		} catch (error) {
			console.log(error, "查询角色权限出错-db");
			return false;
		}
	}
}

module.exports = new AuthClass();
