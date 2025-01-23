const KoaRouter = require("koa-router");

const { authVerify, permVerify } = require("../middlewares/auth.middleware");
const { verifyUpload, verifyUploadV2 } = require("../middlewares/upload.middleware");
const { uploadImgLocal, download, uploadImgCloud } = require("../controllers/upload.controller");


const uploadRouter = new KoaRouter({ prefix: "/upload" });

uploadRouter.post("/upload-img", authVerify, verifyUpload, uploadImgLocal);
uploadRouter.post("/upload-img-v2", authVerify, permVerify, verifyUploadV2, uploadImgCloud);
uploadRouter.get("/download/:fileUrl", authVerify, download);

module.exports = uploadRouter;
