"use strict";

const Clingy = require("./index.js");

const cli = new Clingy({
    "hello": {
        fn: () => "Hello World!",
        alias: ["helloworld", "hi"],
        args: []
    },
    "foo": {
        fn: new Clingy({
            "bar": {
                fn: () => "Foo bar",
                alias: ["helloworld", "hi"],
                args: []
            },
            "buzz": {
                fn: () => "Foo buzz",
                alias: ["fob", "hi"],
                args: []
            }
        }),
        alias: ["fob", "fizz"],
        args: []
    }
});

const result = cli;

console.log(result);
