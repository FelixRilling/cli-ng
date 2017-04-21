"use strict";

const Clingy = require("./index.js");

const cli = new Clingy({
    //Tag
    tag: {
        fn: () => {},
        alias: ["t"],
        args: [{
            name: "key",
            type: "string",
            required: true,
            help: "Tag name"
        }, {
            name: "args",
            type: "string",
            required: false,
            default: "",
            help: "args"
        }],
        admin: false,
        outputType: "text",
        help: {
            short: "[ALPHA] YNA tag loading",
            long: "YNA tag loading (ALPHA: report bugs to NobodyRocks)"
        },
        sub: {
            eval: {
                fn: () => {},
                alias: ["debug"],
                args: [{
                    name: "yna",
                    type: "string",
                    required: true,
                    help: "YNA Code"
                }, {
                    name: "args",
                    type: "string",
                    required: false,
                    default: "",
                    help: "args"
                }],
                admin: false,
                outputType: "text",
                help: {
                    short: "[ALPHA] YNA tag eval",
                    long: "YNA tag eval (ALPHA: report bugs to NobodyRocks)"
                }
            },
            set: {
                fn: () => {},
                alias: ["create"],
                args: [{
                    name: "key",
                    type: "string",
                    required: true,
                    help: "Tag name"
                }, {
                    name: "yna",
                    type: "string",
                    required: true,
                    help: "YNA Code"
                }],
                admin: false,
                outputType: "text",
                help: {
                    short: "[ALPHA] YNA tag saving",
                    long: "YNA tag saving (ALPHA: report bugs to NobodyRocks)"
                }
            },
            get: {
                fn: () => {},
                alias: ["load"],
                args: [{
                    name: "key",
                    type: "string",
                    required: true,
                    help: "Tag name"
                }, {
                    name: "args",
                    type: "string",
                    required: false,
                    default: "",
                    help: "args"
                }],
                admin: false,
                outputType: "text",
                help: {
                    short: "[ALPHA] YNA tag loading",
                    long: "YNA tag loading (ALPHA: report bugs to NobodyRocks)"
                },
            }
        }
    },
});

const result = cli.parse("as f asfafstag foo sad dsad sa da");

console.log(result);
