"use strict";

const Clingy = require("./index.js");

const cli = new Clingy({
    "hello": {
        fn: () => "Hello World!",
        alias: ["hi"],
        args: []
    },
    "foo": {
        fn: new Clingy({
            "bar": {
                fn: () => "Foo bar",
                alias: [],
                args: []
            },
            "buzz": {
                fn: () => "Foo buzz",
                alias: [],
                args: []
            }
        }),
        alias: ["fizz"],
        args: []
    }
});

const result = cli.getCommand(["foo","bar"]);

console.log(result);
