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

// 动态构建查询条件
const buildWhereClause = (params, fieldMap) => {
	let where = [];
	let values = [];
	let limitStatement = ";";
  // 特殊字段
	const specialField = ["limit", "offset", "startTime", "endTime"];
	// 模糊查询字段
  const likeField = ["username", "departmentName", "roleName"];

	const { limit, offset, startTime, endTime } = params;
	if (startTime && endTime) {
		where.push("createAt BETWEEN  ? AND ? ");
		values.push(startTime, endTime);
	}

	Object.keys(params).forEach(key => {
		let value = params[key];

		if (specialField.includes(key)) {
			return;
		}

		if (typeof value !== "undefined" && value !== null) {
			where.push(fieldMap[key]);

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

module.exports = {
	arrayToTree,
	buildWhereClause
};
