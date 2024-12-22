const connection = require("../app/database");
const { buildWhereClause } = require("../utils/format");
const { queryTableTotal } = require("./public.service");

class PermissionService {
	async create(params) {
		const { name, description } = params;
		const statement = `
      INSERT INTO permissions(name, description) VALUES(?, ?);
    `;

		try {
			const [result] = await connection.execute(statement, [name, description]);
			return result;
		} catch (error) {
			console.log(error, "创建权限出错-db");
			return false;
		}
	}

	async remove(id) {
		const statement = "DELETE FROM permissions WHERE wid = ?";

		try {
			const [result] = await connection.execute(statement, [id]);
			return result;
		} catch (error) {
			console.log("删除权限出错-db");
			return false;
		}
	}

	async update(params) {
		const { wid, description } = params;

		const statement = "UPDATE permissions SET description = ? WHERE wid = ?";

		try {
			const [result] = await connection.execute(statement, [description, wid]);
			return result;
		} catch (error) {
			console.log("更新权限出错-db");
			return false;
		}
	}

	async getPermossionList(params) {
		const fieldSqlMap = {
			permissionName: "name LIKE ?",
			description: "description LIKE ?"
		};

		const { where, values, limitStatement } = buildWhereClause(
			params,
			fieldSqlMap,
      ["permissionName", "description"]
		);

    const statement = `
      SELECT 
        wid,
        name,
        description,
        DATE_FORMAT(createAt, "%Y-%m-%d %h:%i:%s") AS createTime,
        DATE_FORMAT(updateAt, "%Y-%m-%d %h:%i:%s") AS updateTime
      FROM permissions
      ${where}
      ORDER BY updateAt DESC
      ${limitStatement}
    `;

    try {
      const [totalResult] = await queryTableTotal("permissions", where, values);
      const [ result ] = await connection.execute(statement, values);
      return { result, total: totalResult.total };
    } catch (error) {
      console.log(error, "查询权限列表出错-db");
      return { status: "fail" };
    }
	}

	async queryPermission(fieldKey, fieldValue) {
		const statement = `SELECT * FROM permissions WHERE ${fieldKey} = ?;`;
		try {
			const [result] = await connection.execute(statement, [fieldValue]);
			return result;
		} catch (error) {
			console.log(error, "查询权限出错-db");
			return false;
		}
	}
}

module.exports = new PermissionService();
