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
        alias: ["grooop"],
        sub: {
            foo: {
                fn: () => "bar",
                alias: ["fizz"],
            }
        }
    }
});

const result = cli.parse("fooArgs a b c");

console.log(result);
