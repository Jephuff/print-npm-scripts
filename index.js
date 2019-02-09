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
const inquirer = require('@cheapsteak/inquirer');
const colors = require('ansi-colors');

const displayedPrompt = inquirer.prompt([
  {
    type: 'list',
    name: 'scriptName',
    message: 'Select script to run (or press [esc] to exit)',
    choices: Object.entries(package.scripts).map(
      ([scriptName, scriptContents]) => ({
        name: `${colors.cyan(scriptName)} =>\n    ${colors.green(scriptContents)}`,
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

const execa = require('execa');

displayedPrompt.then(({ scriptName }) => {
  const { stdout, stdin } = execa('npm', ['run', scriptName]);
  stdout.pipe(process.stdout);
});
