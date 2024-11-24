const { logger } = require("@/utils/log4js");

const handleMessage = (message, ctx) => {
	logger.warn(message);
	ctx.body = {
		code: -1,
		message
	};
};

module.exports = handleMessage;
