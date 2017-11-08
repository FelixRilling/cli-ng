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
        }, {}],
    },
    group: {
        fn: () => "Group fn",
        alias: [],
        sub: {
            foo: {
                fn: () => "bar",
                alias: ["fizz"],
            }
        }
    }
}, {

    /**
     * If names should be treated case-sensitive for lookup
     */
    caseSensitive: false,

    /**
     * [Only works with allowQuotedStrings=true]
     * List of characters to support enclosing quotedStrings for
     */
    validQuotes: ["\"", "'"],
});

const result = cli.getAll();

console.log(result.map.get("fooargs"));
