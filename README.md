# Spawn CLI

The super simple cli lib I always wanted.

## Features

1. Create your own cli
2. Auto generates manual
3. Pipe Mode (Default)
4. Interactive mode (use `-i` flag)
5. Argument defaults
6. Simple, clean and get's out of your way

## Quick Start

mycli.js

    const cli = require("@kvnlnt/spawn");

    // Hello
    cli
        .command("Hello", "Prints hello")
        .argument("output", "o", "Hello to")
        .callback(resp => console.log('Hello,', resp.output))
        .example("hello -o=World, "Prints; Hello World");

    // Use the automated help
    cli
        .command("help", "Prints help")
        .callback(cli.printGuide.bind(cli));

    // Start
    cli.defaultCommand('help').start();

Now set up your tool to be a cli with [npm link](https://docs.npmjs.com/cli/link) and you'll get something like this

    $ mycli hello --output=You
    // result => Hello You

### Interactive Mode

You can pass the `-i` flag without a command and use your tool interactively, like this:

    $ mycli -i

## Examples

All examples are in the `./examples` folder.
