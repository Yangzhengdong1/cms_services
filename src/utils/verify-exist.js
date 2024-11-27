const { createError, INTERNAL_PROBLEMS } = require("../constant/error-types");


/**
 * @description: 查询数据库是否存在某条数据
 * @param {*} fieldValue 字段值
 * @param {*} message 数据不存在时的提示语
 * @param {*} fn 查询函数
 * @param {*} ctx 上下文
 * @param {*} fieldKey 字段名称
 */
const verifyExist = async (fieldValue, message, fn, ctx, fieldKey) => {
	let flag = true, result;
  if (fieldKey) {
    result = await fn(fieldKey, fieldValue);
  } else {
    result = await fn(fieldValue);
  }
	if (
		Object.prototype.toString.call(result) === "[object Array]" &&
		!result.length
	) {
		ctx.app.emit("message", message, ctx);
		flag = false;
	}

	if (!result) {
		createError(INTERNAL_PROBLEMS, ctx);
		flag = false;
	}

	return flag;
};

module.exports = {
	verifyExist
};
