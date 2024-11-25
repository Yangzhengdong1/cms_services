const jwt = require("jsonwebtoken");

const { PRIVATE_KEY, PUBLIC_KEY } = require("../app/config");
const createOptions = { expiresIn: 60 * 60 * 24, algorithm: "RS256" };
// const verifyOptions = {
// 	algorithms: ["RS256"]
// };

class JWT {
	createToken(payload, options = createOptions) {
		try {
			console.log(options);
			return jwt.sign(payload, PRIVATE_KEY, options);
		} catch (err) {
			console.log(err, "颁发 token 出错");
			return false;
		}
	}

	verifyToken(token) {
		try {
			return jwt.verify(token, PUBLIC_KEY);
		} catch (err) {
			console.log("解密 token 出错");
			return false;
		}
	}
}

module.exports = new JWT();
