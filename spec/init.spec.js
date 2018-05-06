"use strict";

const Clingy = require("../dist/clingy.common");
const { isInstanceOf, isArray, isFunction } = require("lightdash");

const cli = new Clingy({
    myCommand: {
        fn: () => "About",
        args: [],
        alias: ["why", "?"]
    },
    missingFn: {
        args: [],
        alias: []
    },
    missingArgs: {
        fn: () => {},
        alias: []
    },
    missingAlias: {
        fn: () => {},
        args: []
    },
    missingAll: {},
    nested: {
        fn: () => 1,
        args: [],
        alias: [],
        sub: {
            nested2: {
                fn: () => 4,
                alias: ["nestedMore"],
                sub: {
                    nested3: { fn: () => 5, alias: ["nestedEvenMore"] }
                }
            }
        }
    }
});

describe("Init", () => {
    it("Main", () => {
        expect(() => isInstanceOf(cli, Clingy)).toBeTruthy();
    });

    it("Map size", () => {
        expect(() => cli.map.size === 6).toBeTruthy();
    });

    it("Map aliased size", () => {
        expect(() => cli.map.size === 8).toBeTruthy();
    });

    it("Main command", () => {
        expect(() => isFunction(cli.map.get("myCommand").fn)).toBeTruthy();
        expect(() => isArray(cli.map.get("myCommand").args)).toBeTruthy();
        expect(() => isArray(cli.map.get("myCommand").alias)).toBeTruthy();
        expect(() => cli.map.get("myCommand").sub === null).toBeTruthy();
    });

    it("missingFn command", () => {
        expect(() => isFunction(cli.map.get("missingFn").fn)).toBeTruthy();
    });

    it("missingArgs command", () => {
        expect(() => isArray(cli.map.get("missingArgs").args)).toBeTruthy();
    });

    it("missingAlias command", () => {
        expect(() => isArray(cli.map.get("missingAlias").alias)).toBeTruthy();
    });

    it("missingAll command", () => {
        expect(() => isFunction(cli.map.get("missingAll").fn)).toBeTruthy();
        expect(() => isArray(cli.map.get("missingAll").args)).toBeTruthy();
        expect(() => isArray(cli.map.get("missingAll").alias)).toBeTruthy();
    });

    it("nested command", () => {
        const nested1 = cli.map.get("nested");

        expect(() => isInstanceOf(nested1.sub, Clingy)).toBeTruthy();

        const nested2 = nested1.sub.map.get("nested2");

        expect(() => isInstanceOf(nested2.sub, Clingy)).toBeTruthy();
    });
});
