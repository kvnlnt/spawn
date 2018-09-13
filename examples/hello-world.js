#!/usr/bin/env node

const cli = require("../bin/cli");

// theme
cli
    .header("\n--- HELLO WORLD ---")
    .themeColor("green");

// Hello
cli
    .command("hello", "Prints hello")
    .argument("output", "o", "Text to output")
    .callback(resp => console.log('Hello,', resp.output))
    .example("hello -o=World!", "Prints Hello World!");

// Goodbye
cli
    .command("goodbye", "Prints hello")
    .argument("output", "o", "Text to output")
    .callback(resp => console.log('Goodbye,', resp.output))
    .example("goodbye -o=World!", "Prints Goodbye World!");

// Use the automated help
cli
    .command("help", "Prints help")
    .callback(cli.printGuide.bind(cli));

// Start
cli.defaultCommand('help').start();