const connection = require("../app/database");

const handleBatchStatement = (doubleArray, statement) => {
	// 一次性插入多条数据
	const placeholders = doubleArray.map(() => "(?, ?, ?, ?)").join(", ");
	statement += placeholders;

	// 将二维数组扁平化为一维数组
	const values = doubleArray.flat();

	return [statement, values];
};

class PublicService {
	async queryDictTable(name, fields = ["wid", "name"]) {
		let fieldStr = fields.join(", ");
		const statement = ` SELECT ${fieldStr} FROM ${name} ORDER BY createAt DESC;`;
		try {
			const [result] = await connection.execute(statement, []);
			return result;
		} catch (error) {
			console.log(error, "查询字典表出错-db");
			return false;
		}
	}

	async queryDBExist(name) {
		const statement = `SHOW DATABASES LIKE '${name}';`;
		try {
			const [result] = await connection.execute(statement, []);
			return result;
		} catch (error) {
			console.log(error, "查询数据库出错-db");
			return false;
		}
	}

	// 角色权限关联
	async rolePerm(params) {
		const { roleId, roleName, permissions } = params;
		const paramArray = permissions.map(permission => {
			return [roleId, roleName, permission.wid, permission.name];
		});

		const fragment =
			"INSERT IGNORE INTO role_permissions (role_id, role_name, permission_id, permission_name) VALUES ";
		const [statement, values] = handleBatchStatement(paramArray, fragment);

		try {
			const [result] = await connection.execute(statement, values);
			return result;
		} catch (error) {
			console.log(error, "关联角色权限出错-db");
			return false;
		}
	}

	// 删除角色权限关联
	async removeRolePerm(fieldKey, fieldValue) {
		const statement = `DELETE FROM role_permissions WHERE ${fieldKey} = ?`;

		try {
			const [result] = await connection.execute(statement, [fieldValue]);
			return result;
		} catch (error) {
			console.log(error, "删除角色权限出错-db");
			throw new Error(error);
		}
	}

	// 菜单部门关联
	async menuDept(params) {
		const { departmentId, departmentName, menus } = params;
		const doubleArray = menus.map(menu => {
			return [departmentId, departmentName, menu.wid, menu.name];
		});

		const fragment =
			"INSERT IGNORE INTO department_menus (department_id, department_name, menu_id, menu_name) VALUES ";
		const [statement, values] = handleBatchStatement(doubleArray, fragment);

		try {
			const [result] = await connection.execute(statement, values);
			return result;
		} catch (error) {
			console.log(error, "关联部门菜单出错-db");
			return false;
		}
	}

	// 删除部门菜单
	async removeMenuDept(fieldKey, fieldValue) {
		const statement = `DELETE FROM department_menus WHERE ${fieldKey} = ?`;

		try {
			const [result] = await connection.execute(statement, [fieldValue]);
			return result;
		} catch (error) {
			console.log(error, "删除部门菜单出错-db");
			throw new Error(error);
		}
	}

	// 查询 total
	async queryTableTotal(tableName, where = "", values = []) {
		values = values.slice(0, -2);
		const statement = `SELECT COUNT(*) AS total FROM ${tableName} ${where};`;
		try {
			const [result] = await connection.execute(statement, values);
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}
}

module.exports = new PublicService();
