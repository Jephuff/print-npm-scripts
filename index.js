#!/usr/bin/env node
const readPkgUp = require("read-pkg-up");
const packageInfo = readPkgUp.sync();

const package = packageInfo.pkg;

Object.entries(package.scripts).forEach(([key, script]) => {
  console.log(`${key} => ${script}`)
})
