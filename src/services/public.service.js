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
	async queryDictTable(name) {
		const statement = ` SELECT wid, name FROM ${name} ORDER BY createAt DESC;`;
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

	async rolePerm(params) {
		const { roleId, roleName, permissions } = params;
		const paramArray = permissions.map(permission => {
			return [roleId, roleName, permission.wid, permission.name];
		});

		const fragment = "INSERT IGNORE INTO role_permissions (role_id, role_name, permission_id, permission_name) VALUES ";
    const [ statement, values ] = handleBatchStatement(paramArray, fragment);

		try {
			const [result] = await connection.execute(statement, values);
			return result;
		} catch (error) {
			console.log(error, "关联角色权限出错-db");
			return false;
		}
	}

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

  async queryTableTotal(tableName) {
    const statement = `SELECT COUNT(*) AS total FROM ${tableName};`;
    try {
      const [ result ] = await connection.execute(statement, []);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new PublicService();
