"use strict";

const Clingy = require("../index.js");

const cli = new Clingy({
    about: {
        fn: () => "About",
        args: [],
        alias: ["why", "?"],
    },
    group: {
        fn: () => "Group fn",
        args: [],
        alias: ["grouped"],
        sub: {
            subcommand: {
                fn: () => "Group subcommand",
                args: [],
                alias: ["sub"]
            }
        }
    }
});

describe("Nesting test", function () {
    it("Basic nesting", function () {
        const result = cli.getCommand(["group", "subcommand"]);

        expect(result.success).toBe(true);
    });

    it("Error nesting", function () {
        const result = cli.getCommand(["errrror", "error"]);

        expect(result.success).toBe(false);
    });


    it("Deep nesting", function () {
        const result = cli.getCommand(["group", "subcommand", "foo"]);

        expect(result.success).toBe(true);
    });
});
