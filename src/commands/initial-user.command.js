#!/usr/bin/env node
require("module-alias/register");
const { program } = require("commander");
const inquirer = require("inquirer");
const { hashEncryption } = require("../utils/bcrypt");
const { createV2 } = require("../services/user.service");

program.name("create-initial").description("生成系统初始用户").version("1.0.0");

const execute = async () => {
	const prompt = inquirer.createPromptModule();
	const { username } = await prompt([
		{
			type: "input",
			name: "username",
			message: "请输入初始用户姓名:",
			default: ""
		}
	]);
	const { password } = await prompt([
		{
			type: "input",
			name: "password",
			message: "请输入初始用户密码:",
			default: ""
		}
	]);
	console.log("初始用户参数：", username, password, hashEncryption(password));
	return {
		password: hashEncryption(password),
		username
	};
};

program
	.command("create")
	.description("生成系统初始用户命令")
	.action(async () => {
		const { username, password } = await execute();
    await createV2({ name: username, password });
	});

program
	.command("update")
	.description("更新系统初始用户命令")
	.action(async () => {
		// const { password, username } = await execute();
	});

program.parse(process.argv);
