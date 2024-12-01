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
}

module.exports = new UploadController();
