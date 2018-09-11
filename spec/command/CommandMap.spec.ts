import { CommandMap } from "../../src/command/CommandMap";
import { ICommand } from "../../src/command/ICommand";
import { clingyLoggerRoot } from "../../src/loggerRoot";
import { Level } from "../../src/logaloo/logaloo";

/**
 * Tests for {@link CommandMap}.
 */
describe("CommandMap", () => {

    beforeAll(() => {
        clingyLoggerRoot.level = Level.NONE;
    });

    it("Asserts that CommandMap#hasIgnoreCase checks keys.", () => {
        const commandMap = new CommandMap();
        const command: ICommand = {
            fn: () => null,
            alias: [],
            args: []
        };
        commandMap.set("foo", command);

        expect(commandMap.hasIgnoreCase("foo")).toBeTruthy();
        expect(commandMap.hasIgnoreCase("foO")).toBeTruthy();
        expect(commandMap.hasIgnoreCase("bar")).toBeFalsy();
    });

    it("Asserts that CommandMap#getIgnoreCase checks keys.", () => {
        const commandMap = new CommandMap();
        const command: ICommand = {
            fn: () => null,
            alias: [],
            args: []
        };
        commandMap.set("foo", command);

        expect(commandMap.getIgnoreCase("foo")).toBe(command);
        expect(commandMap.getIgnoreCase("foO")).toBe(command);
        expect(commandMap.getIgnoreCase("bar")).toBeNull();
    });
});
