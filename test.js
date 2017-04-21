"use strict";

const Clingy = require("./index.js");

const cli = new Clingy({
    "hello": {
        fn: () => "Hello World!",
        alias: ["hi"],
        args: []
    },
    "foo": {
        sub: {
            "bar": {
                fn: () => "Foo bar",
                alias: [],
                args: [{
            name: "num1",
            type: "number",
            required: true
        }, {
            name: "num2",
            type: "number",
            required: true
        }]
            },
            "buzz": {
                fn: () => "Foo buzz",
                alias: [],
                args: []
            }
        },
        fn: () => "foo",
        alias: ["fizz"],
        args: []
    },
    "add": {
        fn: args => args.num1 + args.num2,
        alias: ["hi"],
        args: [{
            name: "num1",
            type: "number",
            required: true
        }, {
            name: "num2",
            type: "number",
            required: true
        }]
    },
});

const result = cli.parse("foo bar 1 2 5");

console.log(result);
