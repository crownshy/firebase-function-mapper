const { run } = require("./function-mapper");
const fs = require("fs");

const outputValue = run();

const githubOutputFilePath = process.env.GITHUB_OUTPUT;
if (githubOutputFilePath) {
  fs.appendFileSync(githubOutputFilePath, `DEPLOY_CMD=${outputValue}\n`);
}
