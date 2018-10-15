const chalk = require("chalk");
const header = chalk.blue(`
----------------------------
  S P A W N
----------------------------`);

class Spawn {
  constructor() {
    this.commands = [];
    this.lastCommand = null;
    this._header = header;
    this._defaultCommand = null;
    this._themeColor = "blue";
  }
  argument(arg, abbr = null, desc = "", def = null, cmd = this.lastCommand) {
    cmd.arguments.push({
      name: arg,
      abbr: abbr,
      def: def,
      desc: desc
    });
    if (def) cmd.defaults[arg] = def;
    if (def) cmd.defaults[abbr] = def;
    return this;
  }
  command(cmd, desc) {
    const newCommand = {
      name: cmd,
      desc: desc,
      arguments: [],
      examples: [],
      callback: null,
      defaults: {},
      help: null
    };
    this.commands.push(newCommand);
    this.lastCommand = newCommand;
    return this;
  }
  callback(f) {
    this.lastCommand.callback = f.bind(this);
    return this;
  }
  example(cmd, desc) {
    this.lastCommand.examples.push({
      example: cmd,
      desc: desc
    });
    return this;
  }
  extractArguments(argv) {
    return argv
      .filter(i => i.charAt(0) === "-")
      .map(i => i.replace(/(^-*)/, ""))
      .reduce((acc, i) => {
        acc[i.split("=")[0]] = i.split("=")[1] || true;
        return acc;
      }, {});
  }
  extractCommand(argv) {
    return argv.filter(i => i.charAt(0) !== "-" && i.indexOf("\\") === -1 && i.indexOf("/") === -1).pop();
  }
  extractPipe(cb) {
    if (process.stdin.isTTY) {
      cb();
    } else {
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", pipe => cb(pipe.trim()));
    }
  }
  defaultCommand(defaultCommand) {
    this._defaultCommand = defaultCommand;
    return this;
  }
  header(header) {
    this._header = header;
    return this;
  }
  getCommandByName(cmd) {
    return this.commands.find(i => i.name === cmd);
  }
  printCommandGuide(cmd = null) {
    cmd = this.getCommandByName(cmd);
    if (!cmd) return;
    let padding = Math.max(...cmd.arguments.map(x => x.name.length)) + 2;
    let dots = len => new Array(padding - len).fill(" ", 0, padding - len).join("");
    console.log();
    console.log(cmd.name);
    console.log();
    // arguments
    if (cmd.arguments.length) {
      cmd.arguments.forEach(j => {
        console.log(
          chalk[this._themeColor](`--${j.name},-${j.abbr}`),
          chalk.grey(dots(j.name.length + j.abbr.length)),
          chalk.grey(j.desc)
        );
      });
    }
    // examples
    if (cmd.examples.length) {
      console.log();
      cmd.examples.forEach(j => {
        console.log(`${j.example}`);
        if (j.desc) console.log(chalk.grey(`\u21B3 ${j.desc}`));
      });
      console.log();
    }
  }
  printGuide() {
    console.log(this._header);
    console.log();
    let padding = Math.max(...this.commands.map(x => x.name.length)) + 2;
    let dots = len => new Array(padding - len).fill(" ", 0, padding - len).join("");
    this.commands.forEach(i => {
      console.log(chalk[this._themeColor](i.name), chalk.grey(dots(i.name.length)), i.desc ? chalk.grey(i.desc) : "");
    });
    console.log();
  }
  run(argv = process.argv) {
    let args = this.extractArguments(argv);
    let cmdString = this.extractCommand(argv);
    let cmd = this.getCommandByName(cmdString);
    if (cmd) return this.startPipeMode(cmd, this.squashArguments(cmd, args));
    if (!cmd && args.i) return this.startInteractiveMode();
    if (!cmd && this._defaultCommand) return this.startPipeMode(this.getCommandByName(this._defaultCommand), args);
  }
  squashArguments(cmd, args) {
    if (!cmd) return {};
    let _args = cmd.arguments.reduce((acc, curr) => {
      acc[curr.name] = args[curr.name] || args[curr.abbr] || curr.def;
      return acc;
    }, {});
    return _args;
  }
  startInteractiveMode() {
    const that = this;
    let readline = require("readline");
    let rl = readline.createInterface(process.stdin, process.stdout);
    let prefix = "$ ";
    rl.setPrompt(prefix, prefix.length);
    rl.on("line", processLine);
    rl.on("close", close);
    let originalTTYwrite = rl._ttyWrite;
    rl.prompt();

    function processLine(line) {
      let data = line.trim();
      if (data === "quit" || data === "exit") rl.close();
      let argv = data
        .replace(/ +(?= )/g, "")
        .split(" ")
        .map(i => i.trim());
      let args = that.extractArguments(argv);
      let cmdString = that.extractCommand(argv);
      let cmd = that.getCommandByName(cmdString);
      let mergedArguments = that.squashArguments(cmd, args);
      if (!cmd) return;
      cmd.callback(mergedArguments);
      rl.prompt();
    }

    function keypress(char, key) {
      if (key && key.name && key.name == "q") {
        rl.on("line", processLine);
        rl._ttyWrite = originalTTYwrite; //assign back to original keypress handler
        rl.prompt();
      } else {
        console.log(key);
      }
    }

    function close() {
      process.exit(0);
    }
  }
  startPipeMode(cmd, args) {
    return this.extractPipe(pipe => {
      if (pipe) args.pipe = pipe;
      return cmd.callback(args);
    });
  }
  themeColor(clr) {
    this._themeColor = clr;
  }
}
module.exports = new Spawn();
