#!/usr/bin/env node

const cli = require("../bin/cli");

// Hello
cli
    .command("hello", "Prints hello")
    .argument("output", "o", "Text to output")
    .callback(resp => console.log('Hello,', resp.output))
    .example("hello -o=World!", "Prints Hello World!");

// Use the automated help
cli
    .command("help", "Prints help")
    .callback(cli.printGuide.bind(cli));

// Start
cli.defaultCommand('help').start();