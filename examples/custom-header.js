const cli = require("../bin/cli");
cli.header('Custom Header');
cli
    .command("help", "Prints help")
    .callback(cli.help.bind(cli))


// Start
cli.start();