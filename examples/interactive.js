const cli = require("../bin/cli");

// Pipe Out
cli
    .command("stdout", "outputs string")
    .argument("test", "t", "Number of", 1)
    .callback(args => {
        console.log('stdout', args);
    });

// Pipe In
cli
    .command("stdin", "inputs string")
    .callback(req => {
        console.log('stdin', req);
    });

// Use the automated help
cli
    .command("help", "Prints help")
    .callback(cli.printGuide.bind(cli));

// Start
cli.defaultCommand('help').start();
