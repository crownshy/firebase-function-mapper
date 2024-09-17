const fs = require("fs");

function run(force, mapfile, files, grps, fnxnNames) {
  if (mapfile) var mappings = JSON.parse(fs.readFileSync(mapfile, "utf8"));

  var subsetSelected = (files || grps || fnxnNames) ?? false;

  let deploycmd = "firebase deploy ";
  if (force) deploycmd = deploycmd.concat("--force ");
  deploycmd = deploycmd.concat("--only ");

  if (files) {
    console.log(`Mapping files: ${files}`);
    const filenames = files.split(" ");
    const fnxns = map_files(mappings, filenames);
    deploycmd = deploycmd.concat(fnxns);
  }
  if (grps) {
    console.log(`Mapping groups: ${grps}`);
    const grpnames = grps.split(" ");
    const fnxns = map_groups(mappings, grpnames);
    deploycmd = deploycmd.concat(fnxns);
  }
  if (fnxnNames) {
    console.log(`Using function names: ${fnxnNames}`);
    const fnxnArry = fnxnNames.split(" ");
    const fnxns = build_command(fnxnArry);
    deploycmd = deploycmd.concat(fnxns);
  }

  if (!subsetSelected) {
    if (mapfile) {
      console.log("Mapping function deployment in batches");
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
      console.log("Building command to deploy all functions");
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
