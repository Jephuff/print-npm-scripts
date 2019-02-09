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

const readline = require('readline');
const inquirer = require('inquirer');

const displayedPrompt = inquirer.prompt([
  {
    type: 'list',
    name: 'scriptName',
    message: 'Select a script to run (or press Esc to exit)',
    choices: Object.entries(package.scripts).map(
      ([scriptName, scriptContents]) => ({
        name: `${scriptName} => ${scriptContents}`,
        value: scriptName,
      }),
    ),
  },
]);

readline.emitKeypressEvents(process.stdin);

process.stdin.on('keypress', (ch, key) => {
  if (key && key.name === 'escape') {
    displayedPrompt.ui.close();
  }
});

displayedPrompt.then(({ scriptName }) => {
  console.log(scriptName);
});
