const connection = require("../app/database");

class PublicService {
	async queryDictTable(name) {
		const statement = ` SELECT wid, name FROM ${name}; `;
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
      const [ result ] = await connection.execute(statement, []);
      return result;
    } catch (error) {
      console.log(error, "查询数据库失败-db");
      return false;
    }
  }
}

module.exports = new PublicService();
