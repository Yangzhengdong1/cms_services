/* eslint-disable no-undef */
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const resolve = joinPath => path.resolve(__dirname, joinPath);

const devPath = fs.existsSync(resolve("../../.env.dev"))
	? resolve("../../.env.dev")
	: resolve("../../.env.prod");

const viewsPath = resolve("../views");

const privateKey = fs.readFileSync(resolve("./keys/private.key", "utf8"));
const publicKey = fs.readFileSync(resolve("./keys/public.key", "utf8"));

dotenv.config({ path: devPath });

module.exports = {
	SERVICE_PROT,
	SERVICE_NAME,
	MYSQL_HOST,
	MYSQL_PORT,
	MYSQL_USER,
	MYSQL_PASSWORD,
	MYSQL_DATABASE
} = process.env;

module.exports.VIEWS_PATH = viewsPath;
module.exports.PRIVATE_KEY = privateKey;
module.exports.PUBLIC_KEY = publicKey;
