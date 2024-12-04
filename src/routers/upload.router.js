const KoaRouter = require("koa-router");

const { authVerify } = require("../middlewares/auth.middleware");
const { verifyUpload } = require("../middlewares/upload.middleware");
const { uploadImg } = require("../controllers/upload.controller");


const uploadRouter = new KoaRouter({ prefix: "/upload" });

uploadRouter.post("/upload-img", authVerify, verifyUpload, uploadImg);

module.exports = uploadRouter;
