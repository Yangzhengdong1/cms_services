const axios = require("axios");

const axiosInstance = axios.create({
	timeout: 5000
});

axiosInstance.interceptors.request.use(
	config => {
		return config;
	},
	error => {
		// console.log("请求错误：", error);
		throw error;
	}
);

axiosInstance.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		// console.log("响应错误：", error);
		throw error;
	}
);

module.exports = axiosInstance;
