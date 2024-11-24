const MENU_UPDATE = "menu_update";
const MENU_CREATE = "menu_create";

const urlToPermMap = {
  "/menu/update": MENU_UPDATE,
  "/menu/create": MENU_CREATE
};

const comparePerm = (permissionList, url) => {
  const permissionName = urlToPermMap[url];
  const index = permissionList.findIndex(permission => permission.name === permissionName);
  return index !== -1;
};

module.exports = {
  comparePerm,
	MENU_UPDATE
};
