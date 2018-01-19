"use strict";

const Clingy = require("../dist/clingy.common");

const cli = new Clingy({
    about: {
        fn: () => "About",
        args: [],
        alias: ["why", "?"]
    },
    double: {
        fn: args => {
            return args.number * 2;
        },
        args: [
            {
                name: "number",
                type: "number",
                required: true
            }
        ],
        alias: []
    },
    add: {
        fn: args => {
            return args.a + args.b;
        },
        args: [
            {
                name: "a",
                type: "number",
                required: true
            },
            {
                name: "b",
                type: "number",
                required: true
            }
        ],
        alias: ["addNumbers"]
    }
});

describe("Main test", function() {
    it("Basic get", function() {
        const result = cli.getCommand(["about"]);

        expect(result.success).toBe(true);
    });

    it("Basic command", function() {
        const result = cli.parse("about");

        expect(result.success).toBe(true);
    });

    it("Basic command with redundant args", function() {
        const result = cli.parse("about");

        expect(result.success).toBe(true);
    });

    it("Advanced command with args", function() {
        const result = cli.parse("double 2");

        expect(result.success).toBe(true);
    });

    it("Advanced command without args", function() {
        const result = cli.parse("double");

        expect(result.success).toBe(false);
    });

    it("Advanced command with multiple args", function() {
        const result = cli.parse("add 12 42");

        expect(result.success).toBe(true);
    });
});
