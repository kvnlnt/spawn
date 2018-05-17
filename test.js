var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout),
    prefix = '>> ';

rl.setPrompt(prefix, prefix.length);
rl.on('line', processLine);
rl.on('close', close);

var originalTTYwrite = rl._ttyWrite;

console.log('Type something...\n');
rl.prompt();

function processLine(line) {
    line = line.trim();
    switch (line) {
        case 'keys':
            console.log('Press any key to see key information. Press "q" to exit key mode.');
            rl.removeListener('line', processLine);
            rl._ttyWrite = keypress; //re-assign the keypress handler
            break;
        default:
            console.log('You entered `' + line + '`. Type "keys" to see key information.');
            rl.prompt();
            break;
    }
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
    console.log('\nExiting...');
    process.exit(0);
};