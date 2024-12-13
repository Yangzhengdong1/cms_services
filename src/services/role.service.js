const connection = require("../app/database");
const { buildWhereClause } = require("../utils/format");
const { queryTableTotal, removeRolePerm } = require("./public.service");

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

	async remove(id) {
		const statement = "DELETE FROM roles WHERE wid = ?";

		try {
			const [result] = await connection.execute(statement, [id]);
			return result;
		} catch (error) {
			console.log(error, "删除角色出错-db");
			return false;
		}
	}

  async update(params) {
    const { name, departmentId, description, level, wid } = params;
    const statement = "UPDATE roles SET name = ?, department_id = ?, description = ?, level = ? WHERE wid = ?";
    try {
      // 删除角色原有权限
      await removeRolePerm("role_id", wid);
      const [ result ] = await connection.execute(statement, [name, departmentId, description, level, wid]);
      return result;
    } catch (error) {
      console.log(error, "更新角色出错-db");
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
        level,
        DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') AS createTime,
        DATE_FORMAT(updateAt, '%Y-%m-%d %H:%i:%s') AS updateTime
      FROM
        roles
        ${where} 
      ORDER BY
        updateAt DESC
        ${limitStatement}
      ;
    `;

		try {
			const [totalResult] = await queryTableTotal("roles", where, values);
			const [result] = await connection.execute(statement, values);
			return { result, total: totalResult.total };
		} catch (error) {
			console.log(error, "查询角色列表出错-db");
			return { status: "fail" };
		}
	}

	async getRoleInfo(id) {
		const statement = `
      SELECT
        roles.wid,
        roles.name,
        roles.description,
        -- 查询权限列表，返回 JSON 数组。如果没有权限，返回空数组
        JSON_ARRAYAGG(
        IF
          ( pm.wid IS NOT NULL, -- 如果权限 ID 不为空
            JSON_OBJECT( "id", pm.wid, "name", pm.name, "description", pm.description ), NULL -- 否则返回 NULL（在过滤中会被排除）
          ) 
        ) AS permissions,
        JSON_OBJECT( "id", roles.department_id, "name", d.name ) AS department,
        roles.level,
        DATE_FORMAT(roles.createAt, '%Y-%m-%d %H:%i:%s') AS createTime,
        DATE_FORMAT(roles.updateAt, '%Y-%m-%d %H:%i:%s') AS updateTime
      FROM
        roles
        LEFT JOIN role_permissions rm ON rm.role_id = roles.wid
        LEFT JOIN permissions pm ON rm.permission_id = pm.wid
        LEFT JOIN departments d ON d.wid = roles.department_id 
      WHERE
        roles.wid = ?
      GROUP BY
        roles.wid,
        roles.name,
        roles.description,
        roles.department_id,
        d.name,
        roles.level;
    `;

		try {
			const [result] = await connection.execute(statement, [id]);
			return result;
		} catch (error) {
			console.log(error, "查询角色详情出错-db");
			return false;
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
