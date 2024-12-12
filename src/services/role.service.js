const connection = require("../app/database");
const { buildWhereClause } = require("../utils/format");
const { queryTableTotal } = require("./public.service");

class RoleService {
	async create(params) {
		const { name, departmentId, description } = params;
		const statement =
			"INSERT INTO roles(name, description, department_id) VALUES(?, ?, ?);";

		try {
			const [result] = await connection.execute(statement, [
				name,
				description,
				departmentId
			]);
			return result;
		} catch (error) {
			console.log(error, "创建角色失败-db");
			return false;
		}
	}

	async getRoleList(params) {
		const fieldSqlMap = {
			roleName: "name LIKE ?",
			description: "description LIKE ?",
			departmentId: "department_id = ?",
			level: "level = ?"
		};

		const { where, values, limitStatement } = buildWhereClause(
			params,
			fieldSqlMap
		);

		const statement = `
      SELECT
        wid,
        name,
        description,
        department_id AS departmentId,
        ( SELECT name FROM departments WHERE wid = roles.department_id ) AS departmentName,
      level 
      FROM
        roles
        ${where} 
      ORDER BY
        updateAt DESC
        ${limitStatement}
      ;
    `;

		try {
			const totalResult = await queryTableTotal("roles", where, values);
			const [result] = await connection.execute(statement, values);
      return { result, total: totalResult.total };
		} catch (error) {
			console.log(error, "查询角色列表出错-db");
			return { status: "fail" };
		}
	}

	async queryRole(fieldKey, fieldValue) {
		const statement = `SELECT * FROM roles WHERE ${fieldKey} = ?;`;

		try {
			const [result] = await connection.execute(statement, [fieldValue]);
			return result;
		} catch (error) {
			console.log(error, "查询角色信息出错-db");
			return false;
		}
	}
}

module.exports = new RoleService();
