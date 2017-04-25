"use strict";

const Clingy = require("./index.js");

const cli = new Clingy({
    //Tag
    foo: {
        fn: () => {},
        alias: ["baa"],
        args: [],
    },
    bar: {
        fn: () => {},
        alias: [],
        args: [{
            name: "key",
            type: "string",
            required: true,
        }, {
            name: "args",
            type: "string",
            required: false,
            default: "",
        }],
    },
});

const result = cli.getAll();

console.log(result);
