const connection = require("../app/database");

class MenuService {
	async getMenu(departmentId) {
		let values = [];
		let statement = `
      SELECT
        menus.wid, menus.name, icon, url, parent_id AS parentId, DATE_FORMAT(menus.createAt, '%Y-%m-%d %H:%i:%s') AS createTime, DATE_FORMAT(menus.updateAt, '%Y-%m-%d %H:%i:%s') AS updateTime
      FROM menus 
    `;

		if (departmentId) {
			statement += `
        JOIN department_menus dm 
        ON menus.wid = dm.menu_id WHERE dm.department_id = ?;`;
			values = [departmentId];
		}

		try {
			const [result] = await connection.execute(statement, values);
			return result;
		} catch (error) {
			console.log(error, "查询用户菜单出错");
			return false;
		}
	}

	async update(params) {
		const { name, wid, icon, url, isVisible, orderNum, parentId } = params;
		const statement = `
      UPDATE menus
      SET
        name = ?, icon = ?, url = ?, parent_id = ?, order_num = ?, is_visible = ?
      WHERE wid = ?;
    `;
		try {
			const [result] = await connection.execute(statement, [
				name,
				icon,
				url,
				parentId,
				orderNum,
				isVisible,
				wid
			]);
			return result;
		} catch (error) {
			console.log(error, "修改用户菜单出错-db");
			return false;
		}
	}

	async create(params) {
		const { name, icon, url, isVisible, orderNum, parentId } = params;

		const statement = `
      INSERT INTO menus(name, icon, url, parent_id, order_num, is_visible) VALUES(?, ?, ?, ?, ?, ?);
    `;
		try {
			const [result] = await connection.execute(statement, [
				name,
				icon,
				url,
				parentId,
				orderNum,
				isVisible
			]);
			return result;
		} catch (error) {
			console.log(error, "创建菜单出错-db");
			return false;
		}
	}

	async remove(id) {
		const statement = `
      DELETE FROM menus WHERE wid = ?;
    `;

		try {
			const [result] = await connection.execute(statement, [id]);
			return result;
		} catch (error) {
			console.log(error, "删除菜单出错-db");
			return false;
		}
	}

	async queryMenuExist(wid) {
		const statement = `
      SELECT * FROM menus WHERE wid = ?
    `;
		try {
			const [result] = await connection.execute(statement, [wid]);
			return result;
		} catch (error) {
			console.log(error, "查询菜单出错-db");
			return false;
		}
	}
}

module.exports = new MenuService();
