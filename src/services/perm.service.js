const connection = require("../app/database");

class PermissionService {
  async create(params) {
    const { name, description } = params;
    const statement = `
      INSERT INTO permissions(name, description) VALUES(?, ?);
    `;

    try {
      const [ result ] = await connection.execute(statement, [name, description]);
      return result;
    } catch (error) {
      console.log(error, "创建权限出错-db");
      return false;
    }
  }

  async queryPermission(filedKey, filedValue) {
    const statement = `SELECT * FROM permissions WHERE ${filedKey} = ?;`;
    try {
      const [ result ] = await connection.execute(statement, [filedValue]);
      return result;
    } catch (error) {
      console.log(error, "查询权限出错-db");
      return false;
    }
  }
}

module.exports = new PermissionService();
