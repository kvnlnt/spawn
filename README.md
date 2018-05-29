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
<a href="https://asciinema.org/a/mqQ6LisGGvF9p4EDzsz5BSlZw" target="_blank"><img src="https://asciinema.org/a/mqQ6LisGGvF9p4EDzsz5BSlZw.png" width="400"/></a>

### Basic
mycli.js

    // include lib
    const cli = require("spawn-cli");

    // add a command with it's args
    cli
        .command("hello", "Prints hello")
        .argument("name", "n", "Name")
        .callback(resp => console.log('Hello', resp))
        .example("hello --name=Fred, "Hello [Name]");

    // start
    cli.start();


Now set up your tool to be a cli with [npm link](https://docs.npmjs.com/cli/link) and you'll get something like this

    $ mycli hello --name=You
    // result => Hello You

### Interactive Mode
You can pass the `-i` flag without a command and use your tool interactively, like this:

    $ mycli -i

## Examples
All examples are in the `./examples` folder.