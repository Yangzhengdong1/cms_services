const app = require("./app");
const { SERVICE_PORT, SERVICE_HOST } = require("./app/config");

app.listen(SERVICE_PORT || 8000, () => {
	console.log(`${SERVICE_HOST}:${SERVICE_PORT} \n ( *・ω・)✄╰ひ╯ 服务启动成功~`);
});
