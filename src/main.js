const app = require("./app");
const { SERVICE_PROT, MYSQL_HOST } = require("./app/config");

app.listen(SERVICE_PROT || 8000, () => {
	console.log(`${MYSQL_HOST}:${SERVICE_PROT} \n服务启动成功~`);
});
