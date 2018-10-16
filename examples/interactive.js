// Usage
// -----
// $ node interactive.js -i
// type
// $ help
// outputs the guide
// now try
// stdout --test=testing
// outputs
// stdout { test: 'testing' }

const cli = require("../bin/spawn");

// Pipe Out
cli
  .command("stdout", "outputs string")
  .argument("test", "t", "Number of", 1)
  .callback(args => {
    console.log("stdout", args);
  });

// Pipe In
cli.command("stdin", "inputs string").callback(req => {
  console.log("stdin", req);
});

// Use the automated help
cli.command("help", "Prints help").callback(cli.printGuide);

// Start
cli.defaultCommand("help").run();
