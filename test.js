"use strict";

const Clingy = require("./index");

const cli = new Clingy({
    about: {
        fn: () => {},
        args: [],
        alias: ["why", "?"],
        help: {
            short: "Shows Info about this bot",
            long: "Shows Info about this bot foooooooooooo"
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
    foo: {
        fn: () => {
            return "bar";
        },
        args: [],
        alias: ["fizz"],
        help: {
            short: "Fizz",
            long: "Fizzzzzzzzzzzzzzzzzz"
        }
    }
});


console.log("why 123", cli.parse("why 123"));
//console.log("commit", cli.parse("commit"));
//console.log("commfit", cli.parse("commfit"));

//console.log("help", cli.help());
//console.log("help commit", cli.help("commidt"));
