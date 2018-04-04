const list = require("./tasks/list");
const add = require("./tasks/add");
const remove = require("./tasks/remove");

module.exports = [
  {
    command: "config",
    args: [{ name: "detached", alias: "d", type: Boolean }],
    subCommands: [
      {
        command: "list",
        cb: list
      },
      {
        command: "add",
        cb: add
      },
      {
        command: "remove",
        cb: remove
      }
    ]
  }
];
