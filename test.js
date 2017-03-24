"use strict";

const Clingy = require("./index.js");

const cli = new Clingy({
    about: {
        fn: () => "About",
        args: [],
        alias: ["why", "?"],
        help: {
            short: "Shows Info",
            long: "Shows Info about this app"
        }
    },
    double: {
        fn: (args) => {
            return args.number * 2;
        },
        args: [{
            name: "number",
            type: "number",
            default: "",
            required: true,
            help: "a number"
        }],
        alias: [],
        help: {
            short: "Doubles number",
            long: "Doubles number and returns result"
        }
    },
    add: {
        fn: (args) => {
            return args.a + args.b;
        },
        args: [{
            name: "a",
            type: "number",
            default: "",
            required: true,
            help: "number 1"
        }, {
            name: "b",
            type: "number",
            default: "",
            required: true,
            help: "number 2"
        }],
        alias: ["addNumbers"],
        help: {
            short: "Adds numbers",
            long: "Adds numbers and returns result"
        }
    },
    clap: {
        fn: ()=>{},
        alias: [],
        args: [{
            name: "text",
            type: "string",
            required: true,
            help: "Text to clap"
        }],
        admin: false,
        outputType: "text",
        help: {
            short: "Output a text clapped",
            long: "Output a text clapped"
        }
    },
});

const result = cli.parse("clap   foo");

console.log(result);
