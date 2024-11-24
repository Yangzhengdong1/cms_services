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

module.exports = {
	arrayToTree
};
