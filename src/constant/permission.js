const MENU_UPDATE = "menu_update";
const MENU_CREATE = "menu_create";
const MENU_DELETE = "menu_delete";

// const urlToPermMap = {
//   "/menu/update": MENU_UPDATE,
//   "/menu/create": MENU_CREATE,
//   "/menu/delete": MENU_DELETE
// };

const comparePerm = (permissionList, permissionName) => {
  // const permissionName = urlToPermMap[url];
  const index = permissionList.findIndex(permission => permission.name === permissionName);
  return index !== -1;
};

module.exports = {
  comparePerm,
	MENU_UPDATE,
  MENU_CREATE,
  MENU_DELETE
};
