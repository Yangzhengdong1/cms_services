const path = require("path");
const fs = require("fs");
const { SERVICE_HOST, SERVICE_PORT } = require("../app/config");
const { uploadFileToGithub } = require("../utils/octokit");
const { GITHUB_OWNER, GITHUB_REPO, GITHUB_PROXY } = require("@/app/config");

const {
	createError,
	THIRD_PARTY_INTERFACE_ERROR
} = require("../constant/error-types");

class UploadController {
	async uploadImgLocal(ctx) {
    console.log("本地存储上传~");
		const { file } = ctx.req;
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
				url: `${SERVICE_HOST}:${SERVICE_PORT}/uploads/imgs/${filename}`
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

	async uploadImgCloud(ctx) {
		try {
      console.log("云存储上传~");
			const { file } = ctx.req;
      let filename = file.originalname;
			// filename = `${+new Date()}_${file.originalname}`;
			const fileContent = file.buffer.toString("base64");
			const res = await uploadFileToGithub(filename, fileContent);
      if (res && (res.status === 201 || res.status === 200)) {
        // 原始链接
				// const originalUrl = res.data.content.download_url;
        // 使用 jsdeliver 加速后的链接
        const proxyUrl = `${GITHUB_PROXY}/${GITHUB_OWNER}/${GITHUB_REPO}/imgs/${file.originalname}`;
				const fileInfo = { url: proxyUrl, filename, size: file.size };
				ctx.body = {
					code: 0,
					data: fileInfo
				};
			} else {
				createError(THIRD_PARTY_INTERFACE_ERROR, ctx);
			}
		} catch (error) {
			ctx.body = {
				code: -1,
				message: error.message
			};
		}
	}
}

module.exports = new UploadController();
