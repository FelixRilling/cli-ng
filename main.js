"use strict";

const Clingy = require("./index");

const cli = new Clingy({
    about: {
        fn: () => {},
        args: [],
        alias: ["why", "?"],
        help: {
            desc: "Shows Info about this bot",
            args: "Shows Info about this bot foooooooooooo"
        }
    },
    commit: {
        fn: () => {
            return 1;
        },
        args: [{
            name: "foo",
            type: "number",
            default: "",
            required: true,
            help: "a number"
        }],
        alias: [],
        help: {
            short: "Shows a commit message",
            long: "Shows a commit message foooooooooooo"
        }
    },
    c: {
        fn: () => {
            return "bar";
        },
        args: [],
        alias: ["fizz"],
        help: {
            desc: "Fizz",
            args: "Fizzzzzzzzzzzzzzzzzz"
        }
    }
});


console.log(cli.parse("about foo"));
