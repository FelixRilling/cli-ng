/* eslint-disable @typescript-eslint/unbound-method */
import { Argument } from "../../src/argument/Argument";
import { Clingy } from "../../src/Clingy";
import { Command } from "../../src/command/Command";
import { MapWithCommands } from "../../src/command/MapWithCommands";
import { LookupErrorMissingArgs } from "../../src/lookup/result/LookupErrorMissingArgs";
import { LookupErrorNotFound } from "../../src/lookup/result/LookupErrorNotFound";
import { ResultType } from "../../src/lookup/result/LookupResult";
import { LookupSuccess } from "../../src/lookup/result/LookupSuccess";

/**
 * Integration tests for example {@link Clingy} usage.
 */
describe("ClingyIT", () => {
    const ARG_1_NAME = "val";
    const COMMAND_2_NAME = "bar";
    const COMMAND_1_NAME = "foo";

    let clingy: Clingy;
    let argument1: Argument;
    let command1: Command;
    let command2: Command;

    beforeEach(() => {
        const map: MapWithCommands = new Map();
        argument1 = {
            name: ARG_1_NAME,
            required: true
        };
        command1 = {
            fn: console.log,
            alias: ["fizz", "fuu"],
            args: [argument1]
        };

        map.set(COMMAND_1_NAME, command1);
        command2 = {
            fn: console.log,
            alias: ["baa"],
            args: []
        };

        map.set(COMMAND_2_NAME, command2);
        clingy = new Clingy(map);
    });

    it("Asserts that lookup of commands with args works.", () => {
        const input = "foo 123";
        const lookupResult = clingy.parse(input);

        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect(lookupResult.pathDangling).toEqual(["123"]);
        expect(lookupResult.pathUsed).toEqual(["foo"]);
        expect((<LookupSuccess>lookupResult).args).toEqual(
            new Map([["val", "123"]])
        );
        expect((<LookupSuccess>lookupResult).command).toEqual(command1);
    });

    it("Asserts that lookup of commands without args works.", () => {
        const input = "baa 456";
        const lookupResult = clingy.parse(input);

        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect(lookupResult.pathDangling).toEqual(["456"]);
        expect(lookupResult.pathUsed).toEqual(["baa"]);
        expect((<LookupSuccess>lookupResult).args).toEqual(new Map());
        expect((<LookupSuccess>lookupResult).command).toEqual(command2);
    });

    it("Asserts that lookup of missing commands works.", () => {
        // Noinspection SpellCheckingInspection
        const input = "foob";
        const lookupResult = clingy.parse(input);

        expect(lookupResult.type).toBe(ResultType.ERROR_NOT_FOUND);
        expect(lookupResult.pathDangling).toEqual([]);
        expect(lookupResult.pathUsed).toEqual([input]);
        expect((<LookupErrorNotFound>lookupResult).missing).toEqual(input);
        expect((<LookupErrorNotFound>lookupResult).similar).toEqual(["foo"]);
    });

    it("Asserts that lookup of commands with missing args works.", () => {
        const input = "foo";
        const lookupResult = clingy.parse(input);

        expect(lookupResult.type).toBe(ResultType.ERROR_MISSING_ARGUMENT);
        expect(lookupResult.pathDangling).toEqual([]);
        expect(lookupResult.pathUsed).toEqual([input]);
        expect((<LookupErrorMissingArgs>lookupResult).missing).toEqual([
            argument1
        ]);
    });
});
