const connection = require("../app/database");
const { buildWhereClause } = require("../utils/format");
const { queryTableTotal } = require("./public.service");

class StoryService {
	async create(params) {
		const { content, utterer, userId } = params;
		const statement =
			"INSERT INTO storys(content, utterer, user_id) VALUES(?, ?, ?);";

		try {
			const [result] = await connection.execute(statement, [
				content,
				utterer,
				userId
			]);
			return result;
		} catch (error) {
			console.log(error, "创建树洞出错-db");
			return false;
		}
	}

	async getStoryList(params) {
		const fieldSqlMap = {
			content: "content LIKE ?",
			utterer: "utterer LIKE ?"
		};

    const { where, values, limitStatement } = buildWhereClause(params, fieldSqlMap, ["content", "utterer"]);

    const statement = `
      SELECT
        wid, content, utterer,
        DATE_FORMAT(createAt, "%Y-%m-%d %h:%i:%s") AS createTime
      FROM storys
      ${where}
      ORDER BY updateAt DESC
      ${limitStatement}
    `;

    try {
      const [ totalResult ] = await queryTableTotal("storys", where, values);
      const [ result ] = await connection.execute(statement, values);
      return { result, total: totalResult.total };
    } catch (error) {
      console.log(error, "查询树洞列表出错-db");
      return { status: "fail" };
    }
	}
}

module.exports = new StoryService();
