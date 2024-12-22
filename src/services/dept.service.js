const connection = require("../app/database");
const { INITIAL_USER_ID } = require("@/app/config");

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
			id: "d1.wid = ?",
			parentId: "d1.parent_id = ?",
			departmentName: "d1.name LIKE ?"
		};

		const { where, values, limitStatement } = buildWhereClause(
			params,
			fieldSqlMap
		);

		const statement = `
      SELECT
        d1.wid,
        d1.name,
        d1.parent_id AS parentId,
        d2.name AS parentName,
        -- 独立查询 Users 聚合结果
        COALESCE(
          (
            SELECT
              JSON_ARRAYAGG( JSON_OBJECT( "wid", u.wid, "name", u.real_name ) ) 
            FROM
              users u 
            WHERE
              u.department_id = d1.wid 
              AND u.wid != '${INITIAL_USER_ID}'
          ),
          JSON_ARRAY()
        ) AS users,
        -- 独立查询 Roles 聚合结果
        COALESCE(
          (
            SELECT
              JSON_ARRAYAGG( JSON_OBJECT( "wid", r.wid, "name", r.name, "level", r.level ) ) 
            FROM
              roles r 
            WHERE
              r.department_id = d1.wid
          ),
          JSON_ARRAY()
        ) AS roles,
        JSON_ARRAYAGG(JSON_OBJECT("wid", dm.menu_id, "name", dm.menu_name)) AS menus,
        DATE_FORMAT( d1.createAt, '%Y-%m-%d %H:%i:%s' ) AS createTime,
        DATE_FORMAT( d1.updateAt, '%Y-%m-%d %H:%i:%s' ) AS updateTime 
      FROM
        departments d1
        LEFT JOIN departments d2 ON d1.parent_id = d2.wid
        LEFT JOIN department_menus dm ON d1.wid = dm.department_id
      ${where}
      GROUP BY
        d1.wid,
        d1.name,
        d1.parent_id,
        d2.name 
      ORDER BY
	      d1.createAt DESC
        ${limitStatement}`;

		try {
			const [totalResult] = await queryTableTotal("departments d1", where, values);
			const [result] = await connection.execute(statement, values);
			return { result, total: totalResult.total };
		} catch (error) {
			console.log(error, "查询部门列表出错-db");
			return { status: "fail" };
		}
	}
}

module.exports = new DepartmentService();
