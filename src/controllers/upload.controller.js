const path = require("path");
const fs = require("fs");
const { SERVICE_HOST, SERVICE_PROT } = require("../app/config");

class UploadController {
	async uploadImg(ctx) {
		const { file } = ctx.req;
		console.log(file);
		let code = -1;
		let message = "上传失败！";
		let data = {};

		if (file.filename) {
			const { filename, size, mimetype } = file;
			code = 0;
			message = "上传成功~";
			data = {
				filename,
				size,
				mimetype,
				url: `${SERVICE_HOST}:${SERVICE_PROT}/uploads/imgs/${filename}`
			};
		}

		ctx.body = {
			code,
			message,
			data
		};
	}

	async download(ctx) {
		const { fileUrl } = ctx.params;
		if (!fileUrl) {
			return;
		}

		const fileName = fileUrl.split(".")[0];

		const staticPath = path.resolve(__dirname, "../../uploads/imgs");
		const filePath = path.resolve(staticPath, fileUrl);

		if (fs.existsSync(filePath)) {
			// 设置响应头以强制下载
			ctx.set("Content-Disposition", `attachment; filename="${fileName}"`);
			ctx.set("Content-Type", "image/jpeg"); // 通用下载类型
			ctx.body = fs.createReadStream(filePath); // 返回文件内容
		} else {
			ctx.body = {
				code: -1,
				message: "文件不存在！"
			};
		}
	}
}

module.exports = new UploadController();
