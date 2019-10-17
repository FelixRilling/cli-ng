import { Argument } from "../../../src/argument/Argument";
import { Clingy } from "../../../src/Clingy";
import { Command } from "../../../src/command/Command";
import { CommandMap } from "../../../src/command/CommandMap";
import { ArgumentResolving } from "../../../src/lookup/ArgumentResolving";
import { LookupResolver } from "../../../src/lookup/LookupResolver";
import { LookupErrorMissingArgs } from "../../../src/lookup/result/LookupErrorMissingArgs";
import { LookupErrorNotFound } from "../../../src/lookup/result/LookupErrorNotFound";
import { ResultType } from "../../../src/lookup/result/LookupResult";
import { LookupSuccess } from "../../../src/lookup/result/LookupSuccess";

const noopFn = (): void => {};

const createMockCommand = (
    args: Argument[] = [],
    sub: Clingy | null = null
): Command => {
    return {
        fn: noopFn,
        args,
        alias: [],
        sub
    };
};

const createMockArg = (
    name: string,
    required: boolean,
    defaultValue = "defaultValue"
): Argument => {
    return {
        name,
        required,
        defaultValue
    };
};

/**
 * Tests for {@link LookupResolver}.
 */
describe("LookupResolver", () => {
    it("Asserts that LookupResolver#resolve throws an Error for an empty path.", () => {
        expect(() => {
            new LookupResolver().resolve(
                new CommandMap(),
                [],
                ArgumentResolving.IGNORE
            );
        }).toThrow();
    });

    it("Asserts that LookupResolver#resolve returns an ILookupErrorNotFound for non-existent commands.", () => {
        const commandName = "foo";

        const lookupResult = new LookupResolver().resolve(
            new CommandMap(),
            [commandName],
            ArgumentResolving.IGNORE
        );
        expect(lookupResult.type).toBe(ResultType.ERROR_NOT_FOUND);
        expect((<LookupErrorNotFound>lookupResult).missing).toBe(commandName);
        expect(lookupResult.pathUsed).toEqual([commandName]);
        expect(lookupResult.pathDangling).toEqual([]);
    });

    it("Asserts that LookupResolver#resolve returns an ILookupErrorMissingArgs when arguments are missing.", () => {
        const commandName = "foo";
        const argument: Argument = { name: "bar", required: true };
        const command = createMockCommand([argument]);
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);

        const lookupResult = new LookupResolver().resolve(
            commandMap,
            [commandName],
            ArgumentResolving.RESOLVE
        );
        expect(lookupResult.type).toBe(ResultType.ERROR_MISSING_ARGUMENT);
        expect((<LookupErrorMissingArgs>lookupResult).missing).toEqual([
            argument
        ]);
        expect(lookupResult.pathUsed).toEqual([commandName]);
        expect(lookupResult.pathDangling).toEqual([]);
    });

    it("Asserts that LookupResolver#resolve returns the command.", () => {
        const commandName = "foo";
        const command = createMockCommand();
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);

        const lookupResult = new LookupResolver().resolve(
            commandMap,
            [commandName],
            ArgumentResolving.IGNORE
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResult).command).toBe(command);
        expect(lookupResult.pathUsed).toEqual([commandName]);
        expect(lookupResult.pathDangling).toEqual([]);
    });

    it("Asserts that LookupResolver#resolve returns a resolved arguments map.", () => {
        const commandName = "foo";
        const argumentName = "lorem";
        const argumentVal = "bar";
        const argument = createMockArg(argumentName, true);
        const command = createMockCommand([argument]);
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);

        const lookupResult = new LookupResolver().resolve(
            commandMap,
            [commandName, argumentVal],
            ArgumentResolving.RESOLVE
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResult).command).toBe(command);
        expect((<LookupSuccess>lookupResult).args).toEqual(
            new Map([[argumentName, argumentVal]])
        );
        expect(lookupResult.pathUsed).toEqual([commandName]);
        expect(lookupResult.pathDangling).toEqual([argumentVal]);
    });

    it("Asserts that LookupResolver#resolve returns dangling path elements.", () => {
        const commandName = "foo";
        const commandNames = [commandName, "bar", "fizz"];
        const command = createMockCommand();
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);

        const lookupResult = new LookupResolver().resolve(
            commandMap,
            commandNames,
            ArgumentResolving.IGNORE
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResult).command).toBe(command);
        expect(lookupResult.pathUsed).toEqual([commandName]);
        expect(lookupResult.pathDangling).toEqual(commandNames.slice(1));
    });

    it("Asserts that LookupResolver#resolve honors caseSensitive.", () => {
        const commandName = "foo";
        const command = createMockCommand();
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);

        const lookupResultCaseSensitive = new LookupResolver(true).resolve(
            commandMap,
            ["foO"],
            ArgumentResolving.IGNORE
        );
        expect(lookupResultCaseSensitive.type).toBe(ResultType.ERROR_NOT_FOUND);

        const lookupResultCaseInsensitive = new LookupResolver(false).resolve(
            commandMap,
            ["foO"],
            ArgumentResolving.IGNORE
        );
        expect(lookupResultCaseInsensitive.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResultCaseInsensitive).command).toBe(
            command
        );
    });
    it("Asserts that LookupResolver#resolve resolves sub-commands.", () => {
        const commandName2 = "bar";
        const command2 = createMockCommand();
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const commandName1 = "foo";
        const command1 = createMockCommand([], clingy);
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const lookupResult = new LookupResolver().resolve(
            commandMap1,
            [commandName1, commandName2],
            ArgumentResolving.IGNORE
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResult).command).toBe(command2);
        expect(lookupResult.pathUsed).toEqual([commandName1, commandName2]);
        expect(lookupResult.pathDangling).toEqual([]);
    });

    it("Asserts that LookupResolver#resolve resolves sub-commands arguments", () => {
        const commandName2 = "bar";
        const argumentName = "baa";
        const argument = createMockArg(argumentName, true);
        const command2 = createMockCommand([argument]);
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const commandName1 = "foo";
        const command1 = createMockCommand([], clingy);
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const argumentVal = "fizz";
        const lookupResult = new LookupResolver().resolve(
            commandMap1,
            [commandName1, commandName2, argumentVal],
            ArgumentResolving.RESOLVE
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResult).command).toBe(command2);
        expect((<LookupSuccess>lookupResult).args).toEqual(
            new Map([[argumentName, argumentVal]])
        );
        expect(lookupResult.pathUsed).toEqual([commandName1, commandName2]);
        expect(lookupResult.pathDangling).toEqual([argumentVal]);
    });

    it("Asserts that LookupResolver#resolve resolves sub-commands optional arguments", () => {
        const commandName2 = "bar";
        const argumentName = "baa";
        const argument = createMockArg(argumentName, false);
        const command2 = createMockCommand([argument]);
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const commandName1 = "foo";
        const command1 = createMockCommand([], clingy);
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const argumentVal = "fizz";
        const lookupResult = new LookupResolver().resolve(
            commandMap1,
            [commandName1, commandName2, argumentVal],
            ArgumentResolving.RESOLVE
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResult).command).toBe(command2);
        expect((<LookupSuccess>lookupResult).args).toEqual(
            new Map([[argumentName, argumentVal]])
        );
        expect(lookupResult.pathUsed).toEqual([commandName1, commandName2]);
        expect(lookupResult.pathDangling).toEqual([argumentVal]);
    });

    it("Asserts that LookupResolver#resolve correctly errors for missing sub-command arguments", () => {
        const commandName2 = "bar";
        const argumentName = "baa";
        const argument = createMockArg(argumentName, true);
        const command2 = createMockCommand([argument]);
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const commandName1 = "foo";
        const command1 = createMockCommand([], clingy);
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const lookupResult = new LookupResolver().resolve(
            commandMap1,
            [commandName1, commandName2],
            ArgumentResolving.RESOLVE
        );

        expect(lookupResult.type).toBe(ResultType.ERROR_MISSING_ARGUMENT);
        expect((<LookupErrorMissingArgs>lookupResult).missing).toEqual([
            argument
        ]);
        expect(lookupResult.pathUsed).toEqual([commandName1, commandName2]);
        expect(lookupResult.pathDangling).toEqual([]);
    });

    it("Asserts that LookupResolver#resolve resolves sub-commands with optional arguments which are not present", () => {
        const commandName2 = "bar";
        const argumentName = "baa";
        const argument = createMockArg(argumentName, false);
        const command2 = createMockCommand([argument]);
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const commandName1 = "foo";
        const command1 = createMockCommand([], clingy);
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const lookupResult = new LookupResolver().resolve(
            commandMap1,
            [commandName1, commandName2],
            ArgumentResolving.RESOLVE
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResult).command).toBe(command2);
        expect(lookupResult.pathUsed).toEqual([commandName1, commandName2]);
        expect(lookupResult.pathDangling).toEqual([]);
    });

    it("Asserts that LookupResolver#resolve resolves sub-commands over arguments when matching", () => {
        const commandName2 = "bar";
        const command2 = createMockCommand();
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const argumentName = "argument";
        const argument = createMockArg(argumentName, true);
        const commandName1 = "foo";
        const command1 = createMockCommand([argument], clingy);
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const lookupResult = new LookupResolver().resolve(
            commandMap1,
            [commandName1, commandName2],
            ArgumentResolving.RESOLVE
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResult).command).toBe(command2);
        expect(lookupResult.pathUsed).toEqual([commandName1, commandName2]);
        expect(lookupResult.pathDangling).toEqual([]);
    });

    it("Asserts that LookupResolver#resolve resolves sub-commands over optional arguments when matching", () => {
        const commandName2 = "bar";
        const command2 = createMockCommand();
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const argumentName = "argument";
        const argument = createMockArg(argumentName, false);
        const commandName1 = "foo";
        const command1 = createMockCommand([argument], clingy);
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const lookupResult = new LookupResolver().resolve(
            commandMap1,
            [commandName1, commandName2],
            ArgumentResolving.RESOLVE
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResult).command).toBe(command2);
        expect(lookupResult.pathUsed).toEqual([commandName1, commandName2]);
        expect(lookupResult.pathDangling).toEqual([]);
    });

    it("Asserts that LookupResolver#resolve resolves arguments over sub-commands when not matching", () => {
        const commandName2 = "bar";
        const command2 = createMockCommand();
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const argumentName = "arg1";
        const argument = createMockArg(argumentName, true);
        const commandName1 = "foo";
        const command1 = createMockCommand([argument], clingy);
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const lookupResult = new LookupResolver().resolve(
            commandMap1,
            [commandName1, argumentName],
            ArgumentResolving.RESOLVE
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResult).command).toBe(command1);
        expect((<LookupSuccess>lookupResult).args).toEqual(
            new Map([[argumentName, argumentName]])
        );
        expect(lookupResult.pathUsed).toEqual([commandName1]);
        expect(lookupResult.pathDangling).toEqual([argumentName]);
    });

    it("Asserts that LookupResolver#resolve resolves arguments over sub-commands when not matching optionals", () => {
        const commandName2 = "bar";
        const command2 = createMockCommand();
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy = new Clingy(commandMap2);

        const argumentName = "arg1";
        const argument = createMockArg(argumentName, false);
        const commandName1 = "foo";
        const command1 = createMockCommand([argument], clingy);
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const lookupResult = new LookupResolver().resolve(
            commandMap1,
            [commandName1, argumentName],
            ArgumentResolving.RESOLVE
        );
        expect(lookupResult.type).toBe(ResultType.SUCCESS);
        expect((<LookupSuccess>lookupResult).command).toBe(command1);
        expect((<LookupSuccess>lookupResult).args).toEqual(
            new Map([[argumentName, argumentName]])
        );
        expect(lookupResult.pathUsed).toEqual([commandName1]);
        expect(lookupResult.pathDangling).toEqual([argumentName]);
    });
});
