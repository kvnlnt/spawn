const C = require("../cli");

// Try running the following to print your name
// $ node basic hello-world --name=YOUR_NAME

C
    .L(C.CMND, "hello-world", "Hello World")
    .L(C.ARGU, "name", "n", "Your Name")
    .L(C.CALL, resp => console.log('Your Name is:', resp.name))
    .L(C.EXPL, "hello-world -name=Fred", "Prints out your name")
    .I()