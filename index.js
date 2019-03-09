#!/usr/bin/env node
const readPkgUp = require("read-pkg-up");
const packageInfo = readPkgUp.sync();

const package = packageInfo.pkg;

if (
  !package.scripts ||
  typeof package.scripts !== "object" ||
  Object.keys(package.scripts).length === 0
) {
  console.log(`Package does not contain 'scripts'\n  ${packageInfo.path}`);
  process.exit();
}

const readline = require("readline");
const colors = require("ansi-colors");
const { prompt, Select } = require("enquirer");

const choices = Object.entries(package.scripts).map(
  ([scriptName, scriptContents]) => ({
    message: `${colors.cyan(scriptName)} => \n    ${colors.green(
      scriptContents
    )}`,
    name: scriptName
  })
);

readline.emitKeypressEvents(process.stdin);

process.stdin.on("keypress", (ch, key) => {
  if (key && key.name === "escape") {
    displayedPrompt.ui.close();
  }
});

const execa = require("execa");

prompt([
  {
    type: 'select',
    styles: {
      em: colors.bold
    },
    limit: Math.floor(process.stdout.rows / 2) - 2,
    name: "scriptName",
    heading: (message, choice, i) => console.log(message, choice, i),
    message: "Select script to run (or press [esc] to exit)",
    choices,
  }
])
  .then(({ scriptName }) => {
    const { stdout, stdin } = execa("npm", ["run", scriptName]);
    stdout.pipe(process.stdout);
  })
  .catch(e => {
    // user likely exited via CTRL-C
  });
