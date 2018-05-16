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
        abbr: ''
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
        state.lastCommand.arguments[arg] = Object.assign({
            abbr: abbr,
            desc: desc
        }, prototypes.argument);
        state.lastArgument = state.lastCommand.arguments[arg];
        return state;
    },
    cmd: (cmd, desc, state) => {
        state.mode = MODE.COMMAND;
        state.commands[cmd] = Object.assign({
            desc: desc
        }, prototypes.command);
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
        console.log(chalk.bold("COMMANDS"));
        console.log();
        Object.keys(state.commands).forEach(i => {
            console.log(' ', i, chalk.grey(state.commands[i].desc));
        });
        console.log();
        console.log(chalk.bold("GUIDE"));
        console.log();
        Object.keys(state.commands).forEach(i => {
            console.log(' ', i, );
            console.log(' ', chalk.grey(state.commands[i].desc));
            console.log()
            Object.keys(state.commands[i].arguments).map(j => {
                return '--' + j + ',-' + state.commands[i].arguments[j].abbr
            }).forEach(i => {
                console.log('   ', i);
            });
            console.log();
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
        if (!cmd) return lib.help(this.state);
        this.state.commands[cmd].cb(args);
    };
    this.CMND = lib.cmd;
    this.CALL = lib.cb;
    this.ARGU = lib.arg;
    this.EXPL = lib.example;
    return this;
})();

C
    .L(C.CMND, "basic", "Basic Example")
    .L(C.ARGU, "test", "t", "test arg")
    .L(C.ARGU, "test2", "x", "test arg")
    .L(C.CALL, res => console.log('basic', res))
    .L(C.EXPL, "basic -t=testing", "Runs bunk test")
    .L(C.CMND, "basic2-with-is-really-long", "Basic Example 2")
    .L(C.CALL, res => console.Log('basic2', res))
    .L(C.ARGU, "test", "t", "test arg")
    .L(C.EXPL, "basic2 -t=testing", "Runs bunk test")
    .I()