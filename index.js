#!/usr/bin/env node
const readPkgUp = require("read-pkg-up");
(async () => {
  const package = (await readPkgUp()).pkg;
  Object.entries(package.scripts).forEach(([key, script]) => {
    console.log(`${key} => ${script}`)
  })
})();
