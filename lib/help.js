const commandLineUsage = require("command-line-usage");
const header = require("./assets/header");
const chalk = require("chalk");

const sections = [
  {
    content: chalk.red(header),
    raw: true
  },
  {
    header: "Synopsis",
    content: [
      "$ example [{bold --timeout} {underline ms}] {bold --src} {underline file} ...",
      "$ example {bold --help}"
    ]
  },
  {
    header: "A typical app",
    content: "Generates something {italic very} important."
  },
  {
    header: "Options",
    optionList: [
      {
        name: "input",
        typeLabel: "{underline file}",
        description: "The input to process."
      },
      {
        name: "help",
        description: "Print this usage guide."
      }
    ]
  }
];

const usage = commandLineUsage(sections);

module.exports = function() {
  console.log(usage);
};
