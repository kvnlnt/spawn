const C = require("../cli");

// Help is built right in, just type any command you didn't register
// $ node help -h

C
    .L(C.COMM, "hello-world", "Prints hello world stuff.")
    .L(C.ARGU, "name", "n", "Your Name")
    .L(C.CALL, resp => console.log('Your Name is:', resp.name))
    .L(C.EXPL, "hello-world --name=Fred", "Print out your name")
    .I()