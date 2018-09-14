import { IArgument } from "../src/argument/IArgument";
import { Clingy } from "../src/Clingy";
import { ICommand } from "../src/command/ICommand";
import { ResultType } from "../src/lookup/result/ILookupResult";
import { ILookupSuccess } from "../src/lookup/result/ILookupSuccess";
import { ILookupErrorNotFound } from "../src/lookup/result/ILookupErrorNotFound";
import { ILookupErrorMissingArgs } from "../src/lookup/result/ILookupErrorMissingArgs";
import { Level } from "logby";
import { clingyLoggerRoot } from "../src/loggerRoot";

/**
 * Integration tests for example {@link Clingy} usage.
 */
describe("ClingyIT", () => {
    let clingy: Clingy;
    let argument1: IArgument;
    let command1: ICommand;
    let command2: ICommand;

    beforeAll(() => {
        clingyLoggerRoot.level = Level.NONE;
    });

    beforeEach(() => {
        const commandMap = new Map<string, ICommand>();
        argument1 = {
            name: "val",
            required: true
        };
        command1 = {
            fn: console.log,
            alias: ["fizz", "fuu"],
            args: [argument1]
        };

        commandMap.set("foo", command1);
        command2 = {
            fn: console.log,
            alias: ["baa"],
            args: []
        };

        commandMap.set("bar", command2);
        clingy = new Clingy(commandMap);
    });

    it("Asserts that lookup of commands with args works.", () => {
        const input = "foo 123";
        const lookupResult = clingy.parse(input);

        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect(lookupResult.pathDangling).toEqual(["123"]);
        expect(lookupResult.pathUsed).toEqual(["foo"]);
        expect((<ILookupSuccess>lookupResult).args).toEqual(
            new Map([["val", "123"]])
        );
        expect((<ILookupSuccess>lookupResult).command).toEqual(command1);
    });

    it("Asserts that lookup of commands without args works.", () => {
        const input = "baa 456";
        const lookupResult = clingy.parse(input);

        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect(lookupResult.pathDangling).toEqual(["456"]);
        expect(lookupResult.pathUsed).toEqual(["baa"]);
        expect((<ILookupSuccess>lookupResult).args).toEqual(new Map());
        expect((<ILookupSuccess>lookupResult).command).toEqual(command2);
    });

    it("Asserts that lookup of missing commands works.", () => {
        // noinspection SpellCheckingInspection
        const input = "foob";
        const lookupResult = clingy.parse(input);

        expect(lookupResult.type).toBe(ResultType.ERROR_NOT_FOUND);
        expect(lookupResult.pathDangling).toEqual([]);
        expect(lookupResult.pathUsed).toEqual([input]);
        expect((<ILookupErrorNotFound>lookupResult).missing).toEqual(input);
        expect((<ILookupErrorNotFound>lookupResult).similar).toEqual(["foo"]);
    });

    it("Asserts that lookup of commands with missing args works.", () => {
        const input = "foo";
        const lookupResult = clingy.parse(input);

        expect(lookupResult.type).toBe(ResultType.ERROR_MISSING_ARGUMENT);
        expect(lookupResult.pathDangling).toEqual([]);
        expect(lookupResult.pathUsed).toEqual([input]);
        expect((<ILookupErrorMissingArgs>lookupResult).missing).toEqual([
            argument1
        ]);
    });
});
