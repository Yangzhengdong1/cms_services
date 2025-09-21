const connection = require("../app/database");
const { buildInsertParams } = require("../utils/sql-builder");

class FileService {
	static FILES_FIELD_MAP = {
		wid: "wid",
		url: "url",
		proxyUrl: "proxy_url",
		fileName: "file_name",
		fileSize: "file_size",
		fileType: "file_type",
		token: "token",
		repo: "repo",
		owner: "owner",
		createdId: "created_id",
		createdBy: "created_by",
		createdAt: "created_at"
	};
	create(params) {
		try {
			const { values, valsplaceholder, keysPlaceholder } = buildInsertParams(
				FileService.FILES_FIELD_MAP,
				params
			);
			const statement = `INSERT INTO files (${keysPlaceholder}) VALUES (${valsplaceholder});`;
			const result = connection.execute(statement, values);
			return result;
		} catch (error) {
			console.log(error, "创建文件记录出错-db");
			return false;
		}
	}
}

module.exports = new FileService();
