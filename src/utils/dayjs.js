const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
require("dayjs/locale/zh-cn");
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const timeAgoFormat = timestamp => {
	const aFewAgo = new Date(timestamp).getTime() - 1 * 60 * 1000;
	return dayjs(aFewAgo).fromNow();
};

module.exports = {
	timeAgoFormat
};
