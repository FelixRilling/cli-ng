"use strict";

const Clingy = require("./index.js");

const cli = new Clingy({
    about: {
        fn: () => "About",
        args: [],
        alias: ["why", "?"],
    },
    myGroup: {
        fn: () => "Group fn",
        args: [],
        alias: ["group"],
        sub: {
            foo: {
                fn: () => "Group subcommand 1",
                args: [],
                alias: ["fizz"]
            },
            bar: {
                fn: () => "Group subcommand 2",
                args: [],
                alias: ["baaa"]
            }
        }
    }
},{
    caseSensitive: true,
    suggestSimilar: true
});

const result = cli.parse("myGroup foo");

console.log(result);
