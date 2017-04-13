"use strict";

const Clingy = require("./index.js");

const cli = new Clingy({
    hello:{
        fn:()=>"Hello World!",
        alias: ["helloworld", "hi"],
        args: []
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

const result = cli.parse("hello");

console.log(result);
