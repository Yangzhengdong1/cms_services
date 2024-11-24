const connection = require("../app/database");

class UserService {
	async create(params) {
		const { username, password, phone, departmentId, roleId, isActive } =
			params;
		const statement = `INSERT INTO users(name, password, phone, department_id, role_id, is_active) VALUES(?, ?, ?, ?, ?, ?);`;
		try {
			const [result] = await connection.execute(statement, [
				username,
				password,
				phone,
				departmentId,
				roleId,
				isActive
			]);
			return result;
		} catch (err) {
			console.log(err, "数据库插入用户出错");
			return false;
		}
	}

	/**
	 * @description: 根据字段名称查询数据库中是否存在当前用户
	 * @param {*} filedKey 字段Key
	 * @param {*} filedValue 字段value
	 */
	async queryUserExist(filedKey, filedValue) {
		let statement = `SELECT wid, name AS username, password, phone, department_id AS departmentId, role_id AS roleId, DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') AS createTime, DATE_FORMAT(updateAt, '%Y-%m-%d %H:%i:%s') AS updateTime FROM users WHERE ${filedKey} = ?;`;
		try {
			const [result] = await connection.execute(statement, [filedValue]);
			return result;
		} catch (err) {
			console.log(err, "数据库查询用户失败");
			return false;
		}
	}
}

module.exports = new UserService();
