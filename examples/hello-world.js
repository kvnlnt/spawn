#!/usr/bin/env node

// YOUR APP
const hello = resp => {
  if (resp.help === true) return cli.printCommandGuide("hello");
  console.log("Hello,", resp.output);
};

const goodbye = resp => {
  if (resp.help === true) return cli.printCommandGuide("goodbye");
  console.log("Goodbye,", resp.output);
};

// YOUR CLI
const cli = require("../bin/spawn");

// theme
cli.header("\nHELLO WORLD").themeColor("green");

// Hello
cli
  .command("hello", "Prints hello")
  .argument("output", "o", "Text to output")
  .argument("help", "h", "Output help", false)
  .callback(hello)
  .example("hello -o=World!", "Prints Hello World!");

// Goodbye
cli
  .command("goodbye", "Prints hello")
  .argument("output", "o", "Text to output")
  .argument("help", "h", "Output help", false)
  .callback(goodbye)
  .example("goodbye -o=World!", "Prints Goodbye World!");

// Use the automated guide
cli.command("guide", "Prints guide").callback(cli.printGuide.bind(cli));

// Start
cli.defaultCommand("guide").start();
