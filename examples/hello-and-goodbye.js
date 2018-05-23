const cli = require("../bin/cli");

// Hello
cli
    .command("hello", "Prints hello")
    .argument("firstName", "f", "First Name", "Kevin")
    .argument("lastName", "l", "Last Name")
    .callback(resp => console.log('hello', resp))
    .example("hello --firstName=Fred --lastName=Flinstone", "Print out hello");

// Goodbye
cli
    .command("goodbye", "Prints goodbye")
    .argument("firstName", "f", "First Name")
    .argument("lastName", "l", "Last Name")
    .callback(resp => console.log('goodbye', resp))
    .example("goodbye --firstName=Fred --lastName=Flinstone", "Print out goodbye");

// Use the automated help
cli
    .command("help", "Prints help")
    .callback(cli.help.bind(cli))


// Start
cli.start();