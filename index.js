const core = require("@actions/core");
const fs = require("fs");


try {
  const filenames = core.getInput("filenames");
  const mapfile = core.getInput("map-file");

  var mappings = JSON.parse(fs.readFileSync(mapfile, "utf8"));
  const deploycmd = "firebase deploy --force --only";
  let fnxns = "";
  filenames.forEach(function (filename) {
    const functioncmd = mappings[filename];
    if (functioncmd) {
      fnxns = fnxns.concat(functioncmd, ",");
    } else {
      core.info('Skipping ${filename}. Not found in the mapping file.');
    }
  });
  // TODO does trailing comma hurt?
  core.setOutput("deploy-cmd", deploycmd.concat(" ", fnxns));
} catch (error) {
  core.setFailed(error.message);
}
