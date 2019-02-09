#!/usr/bin/env node
const readPkgUp = require('read-pkg-up');
const packageInfo = readPkgUp.sync();

const package = packageInfo.pkg;

if (
  !package.scripts ||
  typeof package.scripts !== 'object' ||
  Object.keys(package.scripts).length === 0
) {
  console.log(`Package does not contain 'scripts'\n  ${packageInfo.path}`);
  process.exit();
}

Object.entries(package.scripts).forEach(([key, script]) => {
  console.log(`${key} => ${script}`);
});
