const connection = require("../app/database");
const { buildWhereClause } = require("@/utils/format");


class UserService {
	async create(params) {
		const {
			username,
			password,
			phone,
			departmentId,
			roleId,
			isActive,
			roleName,
			departmentName
		} = params;
		const statement = `
      INSERT INTO users
        (name, password, phone, department_id, role_id, is_active, role_name, department_name)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?);`;
		try {
			const [result] = await connection.execute(statement, [
				username,
				password,
				phone,
				departmentId,
				roleId,
				isActive,
				roleName,
				departmentName
			]);
			return result;
		} catch (err) {
			console.log(err, "数据库插入用户出错");
			return false;
		}
	}

	/**
	 * @description: 根据字段名称查询数据库中是否存在当前用户
	 * @param {*} fieldKey 字段Key
	 * @param {*} fieldValue 字段value
	 */
	async queryUserExist(fieldKey, fieldValue) {
		let statement = `
      SELECT 
        wid, name AS username, phone + 0 AS phone, department_id AS departmentId, role_id AS roleId, role_name AS roleName, department_name AS departmentName,
        is_active AS isActive,
        avatar_url AS avatarUrl,
        DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') AS createTime,
        DATE_FORMAT(updateAt, '%Y-%m-%d %H:%i:%s') AS updateTime
      FROM users
      WHERE ${fieldKey} = ?;`;
		try {
			const [result] = await connection.execute(statement, [fieldValue]);
			return result;
		} catch (err) {
			console.log(err, "数据库查询用户失败");
			return false;
		}
	}

	async getUserList(params) {
		const fieldSqlMap = {
			id: "wid = ?",
			username: "name LIKE ?",
			roleName: "role_name LIKE ?",
			departmentName: "department_name LIKE ?",
			phone: "phone = ?"
		};

		const { where, values, limitStatement } = buildWhereClause(params, fieldSqlMap);
		let statement = `
      SELECT
        wid,
        NAME AS username,
        phone + 0 AS phone,
        department_id AS departmentId,
        role_id AS roleId,
        role_name AS roleName,
        department_name AS departmentName,
        is_active AS isActive,
        avatar_url AS avatarUrl,
        DATE_FORMAT( createAt, '%Y-%m-%d %H:%i:%s' ) AS createTime,
        DATE_FORMAT( updateAt, '%Y-%m-%d %H:%i:%s' ) AS updateTime 
      FROM
	      users 
        ${where}
      ORDER BY
	      createAt DESC 
	      ${limitStatement}
    `;

		try {
			const [result] = await connection.execute(statement, values);
			return result;
		} catch (error) {
			console.log(error, "查询用户列表失败-db");
			return false;
		}
	}
}

module.exports = new UserService();
