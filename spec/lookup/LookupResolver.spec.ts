import { IArgument } from "../../src/argument/IArgument";
import { Clingy } from "../../src/Clingy";
import { CommandMap } from "../../src/command/CommandMap";
import { ICommand } from "../../src/command/ICommand";
import { LookupResolver } from "../../src/lookup/LookupResolver";
import { ILookupErrorMissingArgs } from "../../src/lookup/result/ILookupErrorMissingArgs";
import { ILookupErrorNotFound } from "../../src/lookup/result/ILookupErrorNotFound";
import { ResultType } from "../../src/lookup/result/ILookupResult";
import { ILookupSuccess } from "../../src/lookup/result/ILookupSuccess";

// noinspection TsLint
const noopFn = () => {
};

/**
 * Tests for {@link LookupResolver}.
 */
describe("LookupResolver", () => {
    it("Asserts that LookupResolver#resolve throws an Error for an empty path.", () => {
        expect(() => {
            new LookupResolver().resolve(new CommandMap(), []);
        }).toThrow();
    });

    it("Asserts that LookupResolver#resolve returns an ILookupErrorNotFound for non-existent commands.", () => {
        const commandName = "foo";
        const lookupResult = new LookupResolver().resolve(new CommandMap(), [
            commandName
        ]);

        expect(lookupResult.type).toBe(ResultType.ERROR_NOT_FOUND);
        expect((<ILookupErrorNotFound>lookupResult).missing).toBe(commandName);
        expect(lookupResult.pathUsed).toEqual([commandName]);
        expect(lookupResult.pathDangling).toEqual([]);
    });

    it("Asserts that LookupResolver#resolve returns an ILookupErrorMissingArgs when arguments are missing.", () => {
        const commandName = "foo";
        const argument: IArgument = { name: "bar", required: true };
        const command: ICommand = {
            fn: noopFn,
            alias: [],
            args: [argument]
        };
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);
        const lookupResult = new LookupResolver().resolve(
            commandMap,
            [commandName],
            true
        );

        expect(lookupResult.type).toBe(ResultType.ERROR_MISSING_ARGUMENT);
        expect((<ILookupErrorMissingArgs>lookupResult).missing).toEqual([
            argument
        ]);
        expect(lookupResult.pathUsed).toEqual([commandName]);
        expect(lookupResult.pathDangling).toEqual([]);
    });

    it("Asserts that LookupResolver#resolve returns the Command.", () => {
        const commandName = "foo";
        const command: ICommand = {
            fn: noopFn,
            alias: [],
            args: []
        };
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);
        const lookupResult = new LookupResolver().resolve(commandMap, [
            commandName
        ]);

        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<ILookupSuccess>lookupResult).command).toBe(command);
        expect(lookupResult.pathUsed).toEqual([commandName]);
        expect(lookupResult.pathDangling).toEqual([]);
    });

    it("Asserts that LookupResolver#resolve returns a resolved arguments map.", () => {
        const commandName = "foo";
        const argumentName = "lorem";
        const argumentVal = "bar";
        const argument: IArgument = { name: argumentName, required: true };
        const command: ICommand = {
            fn: noopFn,
            alias: [],
            args: [argument]
        };
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);
        const lookupResult = new LookupResolver().resolve(
            commandMap,
            [commandName, argumentVal, "fizz"],
            true
        );

        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<ILookupSuccess>lookupResult).command).toBe(command);
        expect((<ILookupSuccess>lookupResult).args).toEqual(
            new Map([[argumentName, argumentVal]])
        );
    });

    it("Asserts that LookupResolver#resolve returns dangling path elements.", () => {
        const commandName = "foo";
        const commandNames = [commandName, "bar", "fizz"];
        const command: ICommand = {
            fn: noopFn,
            alias: [],
            args: []
        };
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);
        const lookupResult = new LookupResolver().resolve(
            commandMap,
            commandNames
        );

        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<ILookupSuccess>lookupResult).command).toBe(command);
        expect(lookupResult.pathUsed).toEqual([commandName]);
        expect(lookupResult.pathDangling).toEqual(commandNames.slice(1));
    });

    it("Asserts that LookupResolver#resolve honors caseSensitive.", () => {
        const commandName = "foo";
        const command: ICommand = {
            fn: noopFn,
            alias: [],
            args: []
        };
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);

        const lookupResultCaseSensitive = new LookupResolver(true).resolve(
            commandMap,
            ["foO"]
        );
        expect(lookupResultCaseSensitive.type).toBe(ResultType.ERROR_NOT_FOUND);

        const lookupResultCaseInsensitive = new LookupResolver(false).resolve(
            commandMap,
            ["foO"]
        );
        expect(lookupResultCaseInsensitive.type).toBe(ResultType.SUCCESS);
        expect((<ILookupSuccess>lookupResultCaseInsensitive).command).toBe(
            command
        );
    });
    it("Asserts that LookupResolver#resolve resolves sub-commands.", () => {
        const commandName2 = "bar";
        const command2: ICommand = {
            fn: noopFn,
            alias: [],
            args: []
        };
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const commandName1 = "foo";
        const command1: ICommand = {
            fn: noopFn,
            alias: [],
            args: [],
            sub: clingy
        };
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const lookupResult = new LookupResolver().resolve(commandMap1, [
            commandName1,
            commandName2
        ]);
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<ILookupSuccess>lookupResult).command).toBe(command2);
    });

    it("Asserts that LookupResolver#resolve resolves sub-commands arguments", () => {
        const commandName2 = "bar";
        const argumentName = "baa";
        const argument: IArgument = { name: argumentName, required: true };
        const command2: ICommand = {
            fn: noopFn,
            alias: [],
            args: [argument]
        };
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const commandName1 = "foo";
        const command1: ICommand = {
            fn: noopFn,
            alias: [],
            args: [],
            sub: clingy
        };
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const argumentVal = "fizz";
        const lookupResult = new LookupResolver().resolve(
            commandMap1,
            [commandName1, commandName2, argumentVal],
            true
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<ILookupSuccess>lookupResult).command).toBe(command2);
        expect((<ILookupSuccess>lookupResult).args).toEqual(
            new Map([[argumentName, argumentVal]])
        );
    });

    it("Asserts that LookupResolver#resolve resolves sub-commands over arguments when matching", () => {
        const commandName2 = "bar";
        const command2: ICommand = {
            fn: noopFn,
            alias: [],
            args: []
        };
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const arg1 = {
            name: "arg1",
            required: true
        };
        const commandName1 = "foo";
        const command1: ICommand = {
            fn: noopFn,
            alias: [],
            args: [arg1],
            sub: clingy
        };
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const lookupResult = new LookupResolver().resolve(commandMap1, [
            commandName1,
            commandName2
        ], true);
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<ILookupSuccess>lookupResult).command).toBe(command2);
    });

    it("Asserts that LookupResolver#resolve resolves arguments over sub-commands when not matching", () => {
        const commandName2 = "bar";
        const command2: ICommand = {
            fn: noopFn,
            alias: [],
            args: []
        };
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const argumentName = "arg1";
        const arg1 = {
            name: argumentName,
            required: true
        };
        const commandName1 = "foo";
        const command1: ICommand = {
            fn: noopFn,
            alias: [],
            args: [arg1],
            sub: clingy
        };
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const lookupResult = new LookupResolver().resolve(
            commandMap1,
            [commandName1, argumentName],
            true
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<ILookupSuccess>lookupResult).command).toBe(command1);
        expect((<ILookupSuccess>lookupResult).args).toEqual(
            new Map([[argumentName, argumentName]])
        );
    });
});
