const connection = require("../app/database");

class RoleService {
  async create(params) {
    const { name, departmentId, description } = params;
    const statement = "INSERT INTO roles(name, description, department_id) VALUES(?, ?, ?);";

    try {
      const [ result ] = await connection.execute(statement, [name, description ,departmentId]);
      return result;
    } catch (error) {
      console.log(error, "创建角色失败-db");
      return false;
    }
  }


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
