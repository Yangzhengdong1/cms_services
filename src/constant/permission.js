const MENU_UPDATE = "menu_update";
const MENU_CREATE = "menu_create";
const MENU_DELETE = "menu_delete";
const MENU_QUERY = "menu_query";

const USER_CREATE = "user_create";
const USER_DELETE = "user_delete";
const USER_UPDATE = "user_update";
const USER_QUERY = "user_query";

const DEPT_CREATE = "department_create";
const DEPT_DELETE = "department_delete";
const DEPT_UPDATE = "department_update";
const DEPT_QUERY = "department_query";

const PERM_CREATE = "permission_create";
const PERM_DELETE = "permission_delete";
const PERM_UPDATE = "permission_update";
const PERM_QUERY = "permission_query";

const ROLE_CREATE = "role_create";
const ROLE_DELETE = "role_delete";
const ROLE_UPDATE = "role_update";
const ROLE_QUERY = "role_query";

const GOODS_CREATE = "goods_create";
const GOODS_DELETE = "goods_delete";
const GOODS_UPDATE = "goods_update";
const GOODS_QUERY = "goods_query";

const UPLOAD_IMG = "upload_img";
const UPLOAD_FILE = "upload_file";

const urlToPermMap = {
	"/menu/update": MENU_UPDATE,
	"/menu/create": MENU_CREATE,
	"/menu/delete": MENU_DELETE,
	"/menu/query": MENU_QUERY,
	"/menu/get-user-menu": MENU_QUERY,
	"/menu/get-menu-list": MENU_QUERY,

	"/user/create": USER_CREATE,
	"/user/delete": USER_DELETE,
	"/user/update": USER_UPDATE,
	"/user/query": USER_QUERY,
	"/user/info": USER_QUERY,
	"/user/get-list": USER_QUERY,

	"/department/create": DEPT_CREATE,
	"/department/delete": DEPT_DELETE,
	"/department/update": DEPT_UPDATE,
	"/department/query": DEPT_QUERY,
	"/department/get-list": DEPT_QUERY,

	"/permission/create": PERM_CREATE,
	"/permission/delete": PERM_DELETE,
	"/permission/update": PERM_UPDATE,
	"/permission/query": PERM_QUERY,

	"/role/create": ROLE_CREATE,
	"/role/delete": ROLE_DELETE,
	"/role/update": ROLE_UPDATE,
	"/role/query": ROLE_QUERY,
	"/role/detail": ROLE_QUERY,
	"/role/get-permission-list": ROLE_QUERY,
	"/role/get-list": ROLE_QUERY,

  "/goods/create": GOODS_CREATE,
	"/goods/delete": GOODS_DELETE,
	"/goods/update": GOODS_UPDATE,
	"/goods/query": GOODS_QUERY,
	"/goods/detail": GOODS_QUERY,
	"/goods/get-list": GOODS_QUERY,

	"/upload/upload-img": UPLOAD_IMG,
	"/upload/upload-img-v2": UPLOAD_IMG,
	"/upload/file": UPLOAD_FILE
};

const comparePerm = (permissionList, permissionName) => {
	// const permissionName = urlToPermMap[url];
	const index = permissionList.findIndex(
		permission => permission.name === permissionName
	);
	return index !== -1;
};

module.exports = {
	comparePerm,
  urlToPermMap
};
