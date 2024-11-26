const {
	MENU_UPDATE_ARGUMENT_IS_NOT_EMPTY,
	MENU_UPDATE_WID_NOT_FOUND,
	MENU_UPDATE_PARENT_ID_NOT_FOUND,
	MENU_UPDATE_ID_REPETITIVE
} = require("@/constant/messages");
const { createError, INVALID_PARAMETER } = require("../constant/error-types");

const { verifyIdExist } = require("../controllers/menu.controller");

/**
 * @description: 处理菜单更新参数（允许重名/必填参数：name、wid）
 * @param {*} ctx
 * @param {*} next
 */
const verifyUpdate = async (ctx, next) => {
	const { name, wid, icon, url, isVisible, orderNum, parentId } =
		ctx.request.body;

	if (!name || !wid) {
		ctx.app.emit("message", MENU_UPDATE_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	if (parentId && parentId === wid) {
		ctx.app.emit("message", MENU_UPDATE_ID_REPETITIVE, ctx);
		return;
	}

	// 判断 parentId 是否存在
	if (parentId) {
		const flag = await verifyIdExist(
			parentId,
			MENU_UPDATE_PARENT_ID_NOT_FOUND,
			ctx
		);
		if (!flag) {
			return;
		}
	}

	// 判断 wid 是否存在
	const flag = await verifyIdExist(wid, MENU_UPDATE_WID_NOT_FOUND, ctx);
	if (!flag) {
		return;
	}

	const params = {
		name,
		wid,
		icon: icon ? icon : null,
		url: url ? url : null,
		isVisible: isVisible ? isVisible : 1,
		orderNum: orderNum ? orderNum : 0,
		parentId: parentId ? parentId : null
	};
	ctx.menu = { updateParams: params };

	await next();
};

/**
 * @description: 处理菜单创建参数（允许重名/必填参数：name、wid）
 * @param {*} ctx
 * @param {*} next
 */
const verifyCreate = async (ctx, next) => {
	const { name, icon, url, isVisible, orderNum, parentId } = ctx.request.body;
	if (!name) {
		ctx.app.emit("message", MENU_UPDATE_ARGUMENT_IS_NOT_EMPTY, ctx);
		return;
	}

	// 判断 parentId 是否存在
	if (parentId) {
		const flag = await verifyIdExist(
			parentId,
			MENU_UPDATE_PARENT_ID_NOT_FOUND,
			ctx
		);
		if (!flag) {
			return;
		}
	}

	const params = {
		name,
		icon: icon ? icon : null,
		url: url ? url : null,
		isVisible: isVisible ? isVisible : 1,
		orderNum: orderNum ? orderNum : 0,
		parentId: parentId ? parentId : null
	};
	ctx.menu = { createParams: params };

	await next();
};

/**
 * @description: 处理菜单删除参数（必填参数：wid）
 * @param {*} ctx
 * @param {*} next
 */
const verifyDelete = async (ctx, next) => {
	const { id } = ctx.params;

	// 判断是否有这个菜单id
	const flag = await verifyIdExist(id, MENU_UPDATE_WID_NOT_FOUND, ctx);
	if (!flag) {
		return;
	}

	await next();
};

/**
 * @description: 处理菜单分页查询参数
 * @param {*} ctx
 * @param {*} next
 */
const verifyMenuAll = async (ctx, next) => {
	let { pageSize: offset, pageNum: limit } = ctx.query;
	let params = {};

	if (offset && limit) {
		if (isNaN(offset * 1) || isNaN(limit * 1)) {
			createError(INVALID_PARAMETER, ctx);
			return;
		}
		offset = offset > 0 ? offset : 1;
		limit = limit > 0 ? limit : 10;
		params = { limit, offset };
	}

	ctx.menu = { getListParams: params };

	await next();
};

module.exports = {
	verifyUpdate,
	verifyCreate,
	verifyDelete,
	verifyMenuAll
};
