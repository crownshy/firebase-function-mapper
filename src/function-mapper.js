const fs = require("fs");

function run() {
  const argv = require("yargs/yargs")(process.argv.slice(2))
    .boolean("force")
    .array("files")
    .array("groups")
    .array("names")
    .parse();
  const files = argv.files;
  const grps = argv.groups;
  const fnxnNames = argv.names;
  const force = argv.force;
  const mapfile = argv.mapfile;
  if (mapfile) var mappings = JSON.parse(fs.readFileSync(mapfile, "utf8"));

  var subsetSelected = (files || grps || fnxnNames) ?? false;

  let deploycmd = "deploy ";
  if (force) deploycmd = deploycmd.concat("--force ");
  deploycmd = deploycmd.concat("--only ");

  if (files) {
    console.log(`got some files ${files}`);
    const fnxns = map_files(mappings, files);
    deploycmd = deploycmd.concat(fnxns);
  }
  if (grps) {
    console.log(`got some groups ${grps}`);
    const fnxns = map_groups(mappings, grps);
    deploycmd = deploycmd.concat(fnxns);
  }
  if (fnxnNames) {
    console.log(`got some names ${fnxnNames}`);
    const fnxns = build_command(fnxnNames);
    deploycmd = deploycmd.concat(fnxns);
  }

  if (!subsetSelected) {
    if (mapfile) {
      //deploy each group in batches
      var groupNames = Object.keys(mappings.groups);
      const fnxns = build_command(mappings.groups[groupNames[0]]);
      deploycmd = deploycmd.concat(fnxns);
      groupNames = groupNames.splice(1);
      if (groupNames.length > 0) {
        //remove trailing comma here
        deploycmd = deploycmd.substring(0, deploycmd.length - 1);
        deploycmd = deploycmd.concat(";");
      }
      groupNames.forEach(function (groupname) {
        deploycmd = deploycmd.concat("firebase deploy ");
        if (force) deploycmd = deploycmd.concat("--force ");
        deploycmd = deploycmd.concat("--only ");
        deploycmd = deploycmd.concat(build_command(mappings.groups[groupname]));
        // remove trailing comma
        deploycmd = deploycmd.substring(0, deploycmd.length - 1);
        deploycmd = deploycmd.concat(";");
      });
    } else {
      deploycmd = deploycmd.concat("functions,");
    }
  }
  // remove trailing comma or semicolon
  return deploycmd.substring(0, deploycmd.length - 1);
}

function map_files(mappings, files) {
  let fnxns = "";
  files.forEach(function (filename) {
    const functionNames = mappings.files[filename];
    fnxns = fnxns.concat(build_command(functionNames));
    // TODO what to do if file not found?
    // console.log("Skipping ${filename}. Not found in the mapping file.");
  });
  return fnxns;
}

function map_groups(mappings, grps) {
  let fnxns = "";
  grps.forEach(function (groupname) {
    console.log(`group name ${groupname}`);
    const functionNames = mappings.groups[groupname];
    fnxns = fnxns.concat(build_command(functionNames));
    // TODO what to do if file not found?
    // console.log("Skipping ${filename}. Not found in the mapping file.");
  });
  return fnxns;
}

function build_command(functionNames) {
  let fnxns = "";
  functionNames.forEach(function (fnxnName) {
    fnxns = fnxns.concat("functions:", fnxnName, ",");
  });
  return fnxns;
}

module.exports = {
  run,
};
