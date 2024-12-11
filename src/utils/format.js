const arrayToTree = data => {
	const tree = []; // 最终的树结构
	const map = {}; // 用于快速查找节点的哈希表

	// 初始化map
	data.forEach(item => (map[item.wid] = { ...item, childrens: [] }));

	// 遍历数据并构建树
	data.forEach(item => {
		const parentId = item.parentId;
		if (parentId === null) {
			// 将 tree 与 map 关联起来
			tree.push(map[item.wid]);
		} else {
			if (map[parentId]) {
				map[parentId].childrens.push(map[item.wid]);
			} else {
				console.log(`未找到父节点：${parentId}`);
			}
		}
	});

	return tree;
};

/**
 * @description: 动态构建查询条件
 * @param {*} params 参数
 * @param {*} fieldSqlMap 字段sql映射
 * @param {*} likeField 模糊查询字段
 * @return {*} {where, values, limitStatement} 查询条件/值/分页语句
 */
const likeFields = ["username", "departmentName", "roleName", "phone"];
const buildWhereClause = (params, fieldSqlMap, likeField = likeFields) => {
	let where = [];
	let values = [];
	let limitStatement = ";";
	// 特殊字段
	const specialField = ["limit", "offset", "startTime", "endTime"];
	// 模糊查询字段

	const { limit, offset, startTime, endTime } = params;
	if (startTime && endTime) {
		where.push("createAt BETWEEN  ? AND ? ");
		values.push(startTime, endTime);
	}

	// 判断 params 中的属性是否有值
	Object.keys(params).forEach(key => {
		let value = params[key];

		if (specialField.includes(key)) {
			return;
		}

		if (typeof value !== "undefined" && value !== null) {
			// 如果有值将对应的 sql 语句添加进去
			where.push(fieldSqlMap[key]);

			if (likeField.includes(key)) {
				value = `%${value}%`;
			}
			values.push(value);
		}
	});

	// 如果没有这两参数，就将全部符合条件的数据都查出来
	if (limit && offset) {
		limitStatement = "LIMIT ? OFFSET ?;";
		values.push(limit, offset);
	}

	return {
		where: !where.length ? "" : "WHERE " + where.join(" AND "),
		values,
		limitStatement
	};
};

const filterOptionalParams = params => {
	let optionalParams = { ...params };
	for (const key in optionalParams) {
		if (Object.prototype.hasOwnProperty.call(optionalParams, key)) {
			let element = optionalParams[key];
			optionalParams[key] = element ? element : null;
		}
	}

	return optionalParams;
};

module.exports = {
	arrayToTree,
	buildWhereClause,
  filterOptionalParams
};
