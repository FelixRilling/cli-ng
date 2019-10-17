import { Command } from "../../../src/command/Command";
import { CommandMap } from "../../../src/command/CommandMap";
import { CaseSensitivity } from "../../../src/lookup/CaseSensitivity";

/**
 * Tests for {@link CommandMap}.
 */
describe("CommandMap", () => {
    it("Asserts that CommandMap#hasCommand checks keys.", () => {
        const commandMap = new CommandMap();
        const command: Command = {
            fn: () => null,
            alias: [],
            args: []
        };
        commandMap.set("foo", command);

        expect(
            commandMap.hasCommand("foo", CaseSensitivity.INSENSITIVE)
        ).toBeTruthy();
        expect(
            commandMap.hasCommand("foO", CaseSensitivity.INSENSITIVE)
        ).toBeTruthy();
        expect(
            commandMap.hasCommand("bar", CaseSensitivity.INSENSITIVE)
        ).toBeFalsy();
    });

    it("Asserts that CommandMap#getCommand checks keys.", () => {
        const commandMap = new CommandMap();
        const command: Command = {
            fn: () => null,
            alias: [],
            args: []
        };
        commandMap.set("foo", command);

        expect(commandMap.getCommand("foo", CaseSensitivity.INSENSITIVE)).toBe(
            command
        );
        expect(commandMap.getCommand("foO", CaseSensitivity.INSENSITIVE)).toBe(
            command
        );
        expect(
            commandMap.getCommand("bar", CaseSensitivity.INSENSITIVE)
        ).toBeNull();
    });
});
