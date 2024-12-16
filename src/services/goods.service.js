const connection = require("../app/database");
const { buildWhereClause } = require("../utils/format");
const { queryTableTotal } = require("./public.service");
class GoodsService {
	async getGoodsList(params) {
		const fieldSqlMap = {
			title: "title LIKE ?",
			description: "description LIKE ?"
		};
    const likeFields = ["title", "description"];
		const { where, values, limitStatement } = buildWhereClause(
			params,
			fieldSqlMap,
      likeFields
		);
		const statement = `
      SELECT
        wid,
        title,
        description,
        img_url,
        price,
        DATE_FORMAT( createAt, '%Y-%m-%d %H:%i:%s' ) AS createTime,
        DATE_FORMAT( updateAt, '%Y-%m-%d %H:%i:%s' ) AS updateTime
      FROM
        goods
        ${where}
      ORDER BY
        createAt DESC 
        ${limitStatement}
    `;

		try {
			const [totalResult] = await queryTableTotal("goods", where, values);
			const [result] = await connection.execute(statement, values);
			return { result, total: totalResult.total };
		} catch (error) {
			console.log("查询商品列表出错-db");
			return { status: "fail" };
		}
	}
}

module.exports = new GoodsService();
