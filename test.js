"use strict";

const Clingy = require("./index.js");

const cli = new Clingy({
    double: {
        fn: (args) => {
            return args.number * 2;
        },
        alias: ["getDouble"],
        args: [{
            name: "number",
            type: "number",
            default: "",
            required: true,
            help: "a number"
        }],
        help: {
            short: "Doubles number",
            long: "Doubles number and returns result"
        }
    }
});

cli.setCommand({
    add: {
        fn: (args) => {
            return args.number1 + args.number2;
        },
        alias: ["addNumbers", "sum"],
        args: [{
            name: "number1",
            type: "number",
            default: "",
            required: true,
            help: "number 1"
        }, {
            name: "number2",
            type: "number",
            default: 0,
            required: false,
            help: "number 2"
        }],
        help: {
            short: "Adds numbers",
            long: "Adds numbers and returns result"
        },
    }
});

const result = cli.parse("add");

console.log(result);
