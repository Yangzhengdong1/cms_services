const connection = require("../app/database");

class StoryService {
	async create(params) {
    const { content, utterer, userId } = params;
		const statement = "INSERT INTO storys(content, utterer, user_id) VALUES(?, ?, ?);";

		try {
			const [result] = await connection.execute(statement, [content, utterer, userId]);
			return result;
		} catch (error) {
			console.log(error, "创建故事出错-db");
			return false;
		}
	}
}

module.exports = new StoryService();
