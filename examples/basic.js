const cli = require("../cli");

// Hello
cli
    .command("hello", "Prints hello")
    .argument("firstName", "f", null, "First Name")
    .argument("lastName", "l", null, "Last Name")
    .callback(require("./tasks/hello"))
    .example("hello --firstName=Fred --lastName=Flinstone", "Print out hello");

// Goodbye
cli
    .command("goodbye", "Prints goodbye")
    .argument("firstName", "f", null, "First Name")
    .argument("lastName", "l", null, "Last Name")
    .callback(require("./tasks/goodbye"))
    .example("goodbye --firstName=Fred --lastName=Flinstone", "Print out goodbye");

// Use the automated help
cli
    .command("help", "Prints help")
    .callback(cli.help.bind(cli))


// Start
cli.start();