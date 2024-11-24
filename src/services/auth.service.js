const connection = require("../app/database");

class AuthClass {
  async queryRolePermission(roleId) {
    const statement = `
      SELECT p.name, p.description 
      FROM permissions AS p 
      JOIN role_permissions rp 
      ON p.wid = rp.permission_id 
      WHERE rp.role_id = ?;
    `;
    try {
      const [result] = await connection.execute(statement, [roleId]);
      return result;
    } catch (error) {
      console.log(error, "查询角色权限出错-db");
      return false;
    }
  }
}

module.exports = new AuthClass();
