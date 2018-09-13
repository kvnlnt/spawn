const chalk = require("chalk");
const header = chalk.blue(`
----------------------------
  Spawn
----------------------------`);
class CLI {
    constructor() {
        this.commands = [];
        this.lastCommand = null;
        this._header = header;
        this._defaultCommand = null;
        this._themeColor = "blue";
    }
    argument(arg, abbr = null, desc = '', def = null) {
        this.lastCommand.arguments.push({
            name: arg,
            abbr: abbr,
            def: def,
            desc: desc
        });
        if (def) this.lastCommand.defaults[arg] = def;
        if (def) this.lastCommand.defaults[abbr] = def;
        return this;
    }
    command(cmd, desc) {
        const newCommand = {
            name: cmd,
            desc: desc,
            arguments: [],
            examples: [],
            callback: null,
            defaults: {}
        };
        this.commands.push(newCommand);
        this.lastCommand = newCommand;
        return this;
    }
    callback(f) {
        this.lastCommand.callback = f;
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
            .filter(i => i.charAt(0) === '-')
            .map(i => i.replace(/(^-*)/, ''))
            .reduce((acc, i) => {
                acc[i.split('=')[0]] = i.split('=')[1] || true;
                return acc;
            }, {});
    }
    extractCommand(argv) {
        return argv
            .filter(i => i.charAt(0) !== '-' && i.indexOf('\\') === -1 && i.indexOf('\/') === -1)
            .pop();
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
    printGuide() {
        console.log(this._header);
        console.log();
        console.log(chalk[this._themeColor](`COMMANDS\n`));
        this.commands.forEach(i => {
            console.log(chalk.bold(i.name));
            console.log(chalk.grey(i.desc));
            if (i.arguments.length) {
                i.arguments.forEach(j => {
                    console.log(`--${j.name},-${j.abbr}`, chalk.grey(j.desc));
                });
            }
            console.log();
        });
        let hasExamples = this.commands.some(x => x.examples.length);
        if (hasExamples) console.log(chalk[this._themeColor](`EXAMPLES\n`));
        this.commands.forEach(i => {
            if (i.examples.length) {
                i.examples.forEach(j => {
                    console.log(`${j.example}`);
                    console.log(chalk.grey(`${j.desc}\n`));
                });
            }
        });
    }
    squashArguments(cmd, args) {
        if (!cmd) return {};
        let _args = cmd.arguments.reduce((acc, curr) => {
            acc[curr.name] = args[curr.name] || args[curr.abbr] || curr.def;
            return acc;
        }, {});
        return _args;
    }
    start(argv = process.argv) {
        let args = this.extractArguments(argv);
        let cmdString = this.extractCommand(argv);
        let cmd = this.getCommandByName(cmdString);
        if (cmd) return this.startPipeMode(cmd, this.squashArguments(cmd, args));
        if (!cmd && args.i) return this.startInteractiveMode();
        if (!cmd && this._defaultCommand) return this.startPipeMode(this.getCommandByName(this._defaultCommand), args);
    }
    startInteractiveMode() {
        const that = this;
        let readline = require('readline');
        let rl = readline.createInterface(process.stdin, process.stdout);
        let prefix = '$ ';
        rl.setPrompt(prefix, prefix.length);
        rl.on('line', processLine);
        rl.on('close', close);
        let originalTTYwrite = rl._ttyWrite;
        rl.prompt();

        function processLine(line) {
            let data = line.trim();
            if (data === 'quit' || data === 'exit') rl.close();
            let argv = data.replace(/ +(?= )/g, '').split(' ').map(i => i.trim());
            let args = that.extractArguments(argv);
            let cmdString = that.extractCommand(argv);
            let cmd = that.getCommandByName(cmdString);
            let mergedArguments = that.squashArguments(cmd, args);
            if (!cmd) return;
            cmd.callback(mergedArguments);
            rl.prompt();
        };

        function keypress(char, key) {
            if (key && key.name && key.name == 'q') {
                rl.on('line', processLine);
                rl._ttyWrite = originalTTYwrite; //assign back to original keypress handler
                rl.prompt();
            } else {
                console.log(key);
            }
        };

        function close() {
            process.exit(0);
        };
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
module.exports = (new CLI());