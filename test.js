"use strict";

const Clingy = require("./index.js");

const cli = new Clingy({
    foo: {
        fn: () => "bar",
        alias: ["fizz"],
    },
    fooArgs: {
        fn: args => "bar" + args.foo,
        args: [{
            name: "foo",
            required: true
        }],
    },
    group: {
        fn: () => "Group fn",
        sub: {
            foo: {
                fn: () => "bar",
                alias: ["fizz"],
            }
        }
    }
}, {
    caseSensitive: true,
    suggestSimilar: true
});

//const result = cli.parse("myGroup foo");

console.log(cli.getCommand(["fooArgs"]));
