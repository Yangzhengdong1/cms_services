const multer = require("koa-multer");
const path = require("path");

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

const verifyUpload = async (ctx, next) => {
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

module.exports = {
	upload,
	verifyUpload
};
