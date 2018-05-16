const chalk = require("chalk");
const header = chalk.blue(`
█████ ██    ██
██    ██    ██
█████ █████ ██ `)

// MODES
const MODE = {
    COMMAND: 'COMMAND',
    ARGUMENT: 'ARGUMENT'
};

// PROTOTYPES
const prototypes = {
    argument: {
        abbr: null,
        desc: null
    },
    command: {
        arguments: {},
        examples: {}
    }
};

// FUNCS
const lib = {
    arg: (arg, abbr, desc, state) => {
        state.mode = MODE.ARGUMENT;
        state.lastCommand.arguments[arg] = Object.assign({}, prototypes.argument, {
            abbr: abbr,
            desc: desc
        });
        state.lastArgument = state.lastCommand.arguments[arg];
        return state;
    },
    cmd: (cmd, desc, state) => {
        state.mode = MODE.COMMAND;
        state.commands[cmd] = Object.assign({}, prototypes.command, {
            desc: desc
        });
        state.lastCommand = state.commands[cmd];
        return state;
    },
    cb: (cb, state) => {
        state.lastCommand.cb = cb;
        return state;
    },
    debug: (_, state) => {
        console.log(JSON.stringify(state, null, 4));
        return state;
    },
    example: (example, desc, state) => {
        state.lastCommand.examples[example] = desc;
        return state;
    },
    extractArguments(argv) {
        return argv
            .filter(i => i.charAt(0) === '-')
            .map(i => i.replace(/(^-*)/, ''))
            .reduce((acc, i) => {
                acc[i.split('=')[0]] = i.split('=')[1] || true;
                return acc;
            }, {});
    },
    extractCommand(argv) {
        return argv
            .filter(i => i.charAt(0) !== '-' && i.indexOf('\\') === -1 && i.indexOf('\/') === -1)
            .pop();
    },
    header(header, state) {
        state.header = header;
        return state;
    },
    help(state) {
        // console.log(state);
        console.log(state.header);
        console.log();
        console.log(chalk.bold("USAGE"));
        console.log();
        Object.keys(state.commands).forEach(i => {
            console.log(' ', i, );
            console.log(' ', chalk.grey(state.commands[i].desc));
            console.log();
            Object.keys(state.commands[i].arguments).forEach(j => {
                console.log(`    --${j},-${state.commands[i].arguments[j].abbr}`, chalk.grey(state.commands[i].arguments[j].desc));
            });
            console.log();
            Object.keys(state.commands[i].examples).forEach(j => {
                console.log(chalk.grey(`    // ${state.commands[i].examples[j]}`));
                console.log(`    ${j}`);
            });
        });

    }
};

// MAIN
const C = (function (state = {
    commands: {},
    lastCommand: null,
    lastArgument: null,
    mode: null,
    header: header
}) {
    this.state = state;
    this.L = (...args) => {
        let argList = args.slice(1);
        args[0](...argList, this.state);
        return this;
    };
    this.I = (argv = process.argv) => {
        let args = lib.extractArguments(argv);
        let cmd = lib.extractCommand(argv);
        if (!cmd || !this.state.commands[cmd]) return lib.help(this.state);
        this.state.commands[cmd].cb(args);
    };
    this.COMM = lib.cmd;
    this.ARGU = lib.arg;
    this.CALL = lib.cb;
    this.EXPL = lib.example;
    return this;
})();

module.exports = C;