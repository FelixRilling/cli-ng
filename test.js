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
}, {
    /**
     * Options for Lookup (Resolving a command from a string)
     */
    lookup: {
        /**
         * If names should be treated case-sensitive for lookup
         */
        namesAreCaseSensitive: true
    },
    /**
     * Options for Parser (Getting an Array of name/arg strings from a String)
     */
    parser: {
        /**
         * If strings containing spaces should be kept together when enclosed in quotes.
         * true:    'hello world "foo bar"' => ["hello", "world", "foo bar"]
         * false:   'hello world "foo bar"' => ["hello", "world", "\"foo", "bar\""]
         */
        allowQuotedStrings: true,
        /**
         * [Only works with allowQuotedStrings=true]
         * List of characters to support enclosing quotedStrings for
         */
        validQuotes: ["\"","'"],
    }
});

const result = cli.parse("fooArgs a b c 'a b d'");

console.log(result);
