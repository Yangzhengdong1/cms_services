class SQLBuilder {
	buildInsertParams = (tableFieldMap, params) => {
		const values = [];
		let fieldKeys = [];

		// 找出 params 中符合表字段的参数
		Object.keys(params).forEach(key => {
			if (tableFieldMap[key]) {
				fieldKeys.push(tableFieldMap[key]);
				values.push(params[key]);
			}
		});

		// values 占位符
		const valsplaceholder = fieldKeys.map(() => "?").join(", ");
		// keys 占位符
		const keysPlaceholder = fieldKeys.join(", ");
		return {
			fieldKeys,
			values,
			valsplaceholder,
			keysPlaceholder
		};
	};
}

module.exports = new SQLBuilder();
