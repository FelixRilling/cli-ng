"use strict";

const Clingy = require("../dist/clingy.common");

const cli = new Clingy({
    about: {
        fn: () => "About",
        args: [],
        alias: ["why", "?"],
        sub: {
            bar: () => "bar"
        }
    },
    double: {
        fn: args => args.number * 2,
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
        fn: args => args.a + args.b,
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

describe("Parse", () => {
    it("Empty command", () => {
        expect(() => cli.parse("")).toThrowError(
            TypeError,
            "Path does not contain at least one item"
        );
    });

    it("Basic command", () => {
        const result = cli.parse("about");

        expect(result.success).toBe(true);
    });

    it("Basic command with redundant args", () => {
        const result = cli.parse("about a b c d");

        expect(result.success).toBe(true);
    });

    it("Advanced command with args", () => {
        const result = cli.parse("double 2");

        expect(result.success).toBe(true);
    });

    it("Advanced command without args", () => {
        const result = cli.parse("double");

        expect(result.success).toBe(false);
    });

    it("Advanced command with multiple args", () => {
        const result = cli.parse("add 12 42");

        expect(result.success).toBe(true);
    });

    it("Advanced command with stringed args", () => {
        const result = cli.parse('add "12" "42.2"');

        expect(result.success).toBe(true);
    });

    it("Missing command similar", () => {
        const result = cli.parse("ad");

        expect(result.error.similar).toEqual(["add"]);
    });

    it("Missing command similar 2", () => {
        const result = cli.parse("h ello");

        expect(result.error.similar).toEqual(["?"]);
    });
});
