const chalk = require("chalk");
const header = chalk.blue(`
█████ ██    ██
██    ██    ██
█████ █████ ██ `);
class CLI {
    constructor() {
        this.commands = [];
        this.lastCommand = null;
        this._header = header;
    }
    command(cmd, desc) {
        const newCommand = {
            name: cmd,
            desc: desc,
            arguments: [],
            examples: [],
            callback: null,
            defaults: []
        };
        this.commands.push(newCommand);
        this.lastCommand = newCommand;
        return this;
    }
    argument(arg, abbr = null, desc = '', def = null) {
        this.lastCommand.arguments.push({
            name: arg,
            abbr: abbr,
            def: def,
            desc: desc
        });
        if (def) this.lastCommand.defaults.push({
            arg: arg,
            def: def
        });
        return this;
    }
    callback(f) {
        this.lastCommand.callback = f;
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
    help() {
        console.log(this._header);
        console.log();
        this.commands.forEach(i => {
            console.log(chalk.bold(i.name));
            console.log(chalk.grey(i.desc));
            console.log();
            if (i.arguments.length) {
                i.arguments.forEach(j => {
                    console.log(`  --${j.name},-${j.abbr}`, chalk.grey(j.desc));
                });
                console.log();
            }
            if (i.examples.length) {
                i.examples.forEach(j => {
                    if (j.desc) console.log(chalk.grey(`  // ${j.desc}`));
                    console.log(`  ${j.example}`);
                });
            }
            console.log();
        });
    }
    example(cmd, desc) {
        this.lastCommand.examples.push({
            example: cmd,
            desc: desc
        });
        return this;
    }
    header(header) {
        this.header = header;
    }
    start(argv = process.argv) {
        let args = this.extractArguments(argv);
        let cmdString = this.extractCommand(argv);
        let cmd = this.commands.filter(i => i.name === cmdString);
        if (cmd.length) {
            if (cmd[0].defaults.length) cmd[0].defaults.forEach(i => {
                if (!args.hasOwnProperty(i.arg)) args[i.arg] = i.def;
            });
            cmd[0].callback(args);
        }
    }
}
module.exports = (new CLI());