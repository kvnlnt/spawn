const commandLineArgs = require("command-line-args");
const showHelp = require("./help");
const cmdDefs = [{ name: "command", defaultOption: true }];
const cmd = commandLineArgs(cmdDefs, { stopAtFirstUnknown: true });
let argv = cmd._unknown || [];

function run(commands) {
  // handle unfound commands
  if (commands.map(i => i.command).indexOf(cmd.command) === -1)
    return showHelp();

  commands.forEach(i => {
    if (cmd.command === i.command) {
      const runDefs = i.args;
      const runOpts = commandLineArgs(runDefs, {
        argv,
        stopAtFirstUnknown: true
      });
      argv = runOpts._unknown || [];
      if (i.cb) {
        return i.cb(runOpts);
      } else {
        const subCmdDefs = [{ name: "command", defaultOption: true }];
        const subCmd = commandLineArgs(subCmdDefs, {
          argv,
          stopAtFirstUnknown: true
        });
        // handle unfound sub commands
        if (i.subCommands.map(i => i.command).indexOf(subCmd.command) === -1)
          return showHelp();
        i.subCommands.forEach(ii => {
          if (subCmd.command === ii.command) {
            return ii.cb(runOpts);
          }
        });
      }
    }
  });
}

module.exports = run;
