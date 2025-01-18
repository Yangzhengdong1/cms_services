const multer = require("koa-multer");
const path = require("path");
// const { createError, NO_PERMISSION } = require("../constant/error-types");
const { UPLOAD_NO_PERMISSION } = require("@/constant/messages");

const storage = multer.diskStorage({
	destination: (req, file, cb) =>
		cb(null, path.join(__dirname, "../../uploads/imgs/")),
	filename: (req, file, cb) => {
		file.originalname = Buffer.from(file.originalname, "latin1").toString(
			"utf8"
		);
		// const nameArr = encodeURIComponent(file.originalname).split(".");
		const nameArr = file.originalname.split(".");
		const filename = `${nameArr[0]}_${+new Date()}.${
			nameArr[nameArr.length - 1]
		}`;

		cb(null, filename);
	}
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1 * 1024 * 1024 // 设置每个文件最大为 5MB
	}
});
const upload2 = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 1 * 1024 * 1024 // 设置每个文件最大为 5MB
	}
});

/**
 * @description: 本地存储
 * @param {*} ctx
 * @param {*} next
 */
const verifyUpload = async (ctx, next) => {
	console.log("文件上传校验 Middleware: verifyUpload~");

	// 由于图片是放在项目文件夹下存储的，所以需要限制上传，不限制的话内存可能会爆炸
	const { isInitialUser } = ctx.auth.userInfo;
	if (!isInitialUser) {
		// createError(NO_PERMISSION, ctx);
		ctx.app.emit("message", UPLOAD_NO_PERMISSION, ctx);
		return;
	}

	try {
		// todo: 上传名称带有中文字符的图片时会报错
		await upload.single("avatar")(ctx, next);
	} catch (error) {
		ctx.body = {
			code: -1,
			message: error.message
		};
	}
};

/**
 * @description: 云存储
 * @param {*} ctx
 * @param {*} next
 */
const verifyUploadV2 = async (ctx, next) => {
	console.log("文件上传校验 Middleware: verifyUploadV2~");

	try {
		// todo: 上传名称带有中文字符的图片时会报错
		await upload2.single("avatar")(ctx, next);
	} catch (error) {
		ctx.body = {
			code: -1,
			message: error.message
		};
	}
};

module.exports = {
	upload,
	verifyUpload,
	verifyUploadV2
};
