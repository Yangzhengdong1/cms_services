const { Octokit } = require("@octokit/rest");
const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = require("@/app/config");

const repoOwner = GITHUB_OWNER;
const repoName = GITHUB_REPO;
const token = GITHUB_TOKEN;
// const getUploadUrl = fileName =>
// 	`https://api.github.com/repos/${repoOwner}/${repoName}/contents/imgs/${fileName}`;

const octokit = new Octokit({ auth: token });

// 校验文件是否存在并返回 sha
async function getFileSha(owner, repo, fileName) {
	try {
		const { data } = await octokit.repos.getContent({
			owner,
			repo,
			path: `imgs/${fileName}`
		});
		return data.sha; // 文件已存在，返回 sha
	} catch (error) {
		// 文件不存在，返回 null
		return null;
	}
}

// 将文件上传至 github
const uploadFileToGithub = async (filename, fileContent) => {
	try {
		// 获取文件的 SHA（如果文件已存在，用于更新）
		const sha = await getFileSha(repoOwner, repoName, filename);
		const response = await octokit.repos.createOrUpdateFileContents({
			owner: repoOwner,
			repo: repoName,
			path: `imgs/${filename}`,
			message: "Upload file via Octokit",
			content: fileContent,
			sha
		});
		return response;
	} catch (error) {
		throw new Error(error);
	}
};
module.exports = {
	uploadFileToGithub
};
