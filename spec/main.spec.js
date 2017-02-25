"use strict";

const Clingy = require("../index.js");

const cli = new Clingy({
    about: {
        fn: () => "About",
        args: [],
        alias: ["why", "?"],
        help: {
            short: "Shows Info",
            long: "Shows Info about this app"
        }
    },
    double: {
        fn: (args) => {
            return args.number * 2;
        },
        args: [{
            name: "number",
            type: "number",
            default: "",
            required: true,
            help: "a number"
        }],
        alias: [],
        help: {
            short: "Doubles number",
            long: "Doubles number and returns result"
        }
    },
    add: {
        fn: (args) => {
            return args.a + args.b;
        },
        args: [{
            name: "a",
            type: "number",
            default: "",
            required: true,
            help: "number 1"
        }, {
            name: "b",
            type: "number",
            default: "",
            required: true,
            help: "number 2"
        }],
        alias: ["addNumbers"],
        help: {
            short: "Adds numbers",
            long: "Adds numbers and returns result"
        }
    }
});

describe("Main test", function () {

    it("Basic get", function () {
        const result = cli.get("about");

        expect(result.type).toBe("success");
    });

    it("Basic command", function () {
        const result = cli.parse("about");

        expect(result.type).toBe("success");
    });

    it("Basic command with redundant args", function () {
        const result = cli.parse("about foo");

        expect(result.type).toBe("success");
    });

    it("Advanced command with args", function () {
        const result = cli.parse("double 2");

        expect(result.type).toBe("success");
    });

    it("Advanced command without args", function () {
        const result = cli.parse("double");

        expect(result.type).toBe("error");
    });

    it("Advanced command with multiple args", function () {
        const result = cli.parse("add 12 42");

        expect(result.type).toBe("success");
    });
});
