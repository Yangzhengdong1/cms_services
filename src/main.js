const app = require("./app");
const { SERVICE_PROT, SERVICE_HOST } = require("./app/config");

app.listen(SERVICE_PROT || 8000, () => {
	console.log(`${SERVICE_HOST}:${SERVICE_PROT} \n服务启动成功~`);
});
