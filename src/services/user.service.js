const connection = require("../app/database");
const { INITIAL_USER_ID } = require("@/app/config");

const { buildWhereClause } = require("@/utils/format");
const { queryTableTotal } = require("./public.service");
const { buildInsertParams } = require("@/utils/sql-builder");

class UserService {
	TABLE_FIELD_MAP = {
		name: "name",
		realName: "real_name",
		password: "password",
		phone: "phone",
		departmentId: "department_id",
		roleId: "role_id",
		isActive: "is_active",
		roleName: "role_name",
		departmentName: "department_name",
		avatarUrl: "avatar_url"
	};

	async create(params) {
		const {
			username,
			realname,
			password,
			phone,
			departmentId,
			roleId,
			isActive,
			roleName,
			departmentName,
			avatarUrl
		} = params;

		const statement = `
      INSERT INTO users
        (name, real_name, password, phone, department_id, role_id, is_active, role_name, department_name, avatar_url)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

		try {
			const [result] = await connection.execute(statement, [
				username,
				realname,
				password,
				phone,
				departmentId,
				roleId,
				isActive,
				roleName,
				departmentName,
				avatarUrl
			]);

			return result;
		} catch (err) {
			console.log(err, "数据库插入用户出错-db");
			return false;
		}
	}

	async createV2(params) {
		try {
			const { keysPlaceholder, valsplaceholder, values } = buildInsertParams(
				this.TABLE_FIELD_MAP,
				params
			);
			const statement = `INSERT INTO users (${keysPlaceholder}) VALUES(${valsplaceholder});`;
			const [result] = await connection.execute(statement, values);
			return result;
		} catch (error) {
			console.log(error, "创建用户出错");
			return false;
		}
	}

	async remove(id) {
		const statement = "DELETE FROM users WHERE wid = ?";
		try {
			const [result] = await connection.execute(statement, [id]);
			return result;
		} catch (error) {
			console.log(error, "删除用户出错-db");
			return false;
		}
	}

	async update(params) {
		const {
			wid,
			username,
			realname,
			phone,
			departmentId,
			roleId,
			isActive,
			roleName,
			departmentName,
			avatarUrl
		} = params;
		const statement = `
      UPDATE users 
      SET name = ?,
          real_name = ?,
          phone = ?,
          department_id = ?,
          department_name = ?,
          role_id = ?,
          role_name = ?,
          is_active = ?,
          avatar_url = ?
      WHERE
        wid = ?
    `;

		try {
			const [result] = await connection.execute(statement, [
				username,
				realname,
				phone,
				departmentId,
				departmentName,
				roleId,
				roleName,
				isActive,
				avatarUrl,
				wid
			]);
			return result;
		} catch (error) {
			console.log(error, "修改用户出错-db");
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
        wid, name AS username, real_name AS realname, password, phone AS phone, department_id AS departmentId, role_id AS roleId, role_name AS roleName, department_name AS departmentName,
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
			roleId: "role_id = ?",
			departmentId: "department_id = ?",
			username: "name LIKE ?",
			realname: "real_name LIKE ?",
			roleName: "role_name LIKE ?",
			departmentName: "department_name LIKE ?",
			phone: "phone LIKE ?",
			status: "is_active = ?"
		};

		let { where, values, limitStatement } = buildWhereClause(
			params,
			fieldSqlMap
		);

		const ignoreWhere = `wid != "${INITIAL_USER_ID}"`;
		where = where ? `${where} AND ${ignoreWhere}` : `WHERE ${ignoreWhere}`;
		let statement = `
      SELECT
        wid,
        name AS username,
        real_name AS realname,
        phone AS phone,
        department_id AS departmentId,
        role_id AS roleId,
        role_name AS roleName,
        (SELECT level FROM roles WHERE wid = users.role_id) AS level,
        department_name AS departmentName,
        is_active AS isActive,
        avatar_url AS avatarUrl,
        DATE_FORMAT( createAt, '%Y-%m-%d %H:%i:%s' ) AS createTime,
        DATE_FORMAT( updateAt, '%Y-%m-%d %H:%i:%s' ) AS updateTime 
      FROM
	      users 
        ${where}
      ORDER BY
	      updateAt DESC 
	      ${limitStatement}
    `;

		try {
			const [totalResult] = await queryTableTotal("users", where, values);
			const [result] = await connection.execute(statement, values);
			return { total: totalResult.total, result };
		} catch (error) {
			console.log(error, "查询用户列表失败-db");
			return { status: "fail" };
		}
	}
}

module.exports = new UserService();
