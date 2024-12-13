const connection = require("../app/database");
const { buildWhereClause } = require("../utils/format");
const { queryTableTotal, removeMenuDept } = require("./public.service");

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

	async update(params) {
		const { name, parentId, wid } = params;

		const statement =
			"UPDATE departments SET name = ?, parent_id = ? WHERE wid = ?";

		try {
      await removeMenuDept("department_id", wid);
			const [result] = await connection.execute(statement, [
				name,
				parentId,
				wid
			]);
			return result;
		} catch (error) {
			console.log(error, "更新部门出错-db");
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

	async remove(id) {
		const statement = "DELETE FROM departments WHERE wid = ?;";

		try {
			const [result] = await connection.execute(statement, [id]);
			return result;
		} catch (error) {
			console.log("删除部门出错-db");
			return false;
		}
	}

	async getDepartmentList(params) {
		const fieldSqlMap = {
			id: "wid = ?",
			parentId: "parent_id = ?",
			departmentName: "name LIKE ?"
		};

		const { where, values, limitStatement } = buildWhereClause(
			params,
			fieldSqlMap
		);

		const statement = `
      SELECT
	      wid,
	      NAME,
	      parent_id AS parentId,
        DATE_FORMAT( createAt, '%Y-%m-%d %H:%i:%s' ) AS createTime,
	      DATE_FORMAT( updateAt, '%Y-%m-%d %H:%i:%s' ) AS updateTime 
      FROM
	      departments
        ${where}
      ORDER BY
	      createAt DESC
        ${limitStatement}`;

		try {
			const [totalResult] = await queryTableTotal("departments", where, values);
			const [result] = await connection.execute(statement, values);
			return { result, total: totalResult.total };
		} catch (error) {
			console.log(error, "查询部门列表出错-db");
			return { status: "fail" };
		}
	}
}

module.exports = new DepartmentService();
