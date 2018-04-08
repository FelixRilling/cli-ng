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

describe("Get", () => {
    it("Empty Arr", () => {
        expect(() => cli.getCommand([])).toThrowError(
            Error,
            "Path does not contain at least one item"
        );
    });

    it("Empty Arr string", () => {
        const result = cli.getCommand([""]);

        expect(result.success).toBe(false);
    });

    it("Nonexistent", () => {
        const result = cli.getCommand(["foo"]);

        expect(result.success).toBe(false);
    });

    it("Existent", () => {
        const result = cli.getCommand(["about"]);

        expect(result.success).toBe(true);
    });

    it("Nested nonexistent", () => {
        const result = cli.getCommand(["about", "foo"]);

        expect(result.success).toBe(true);
    });

    it("Nested Existent", () => {
        const result = cli.getCommand(["about", "foo"]);

        expect(result.success).toBe(true);
    });
});
