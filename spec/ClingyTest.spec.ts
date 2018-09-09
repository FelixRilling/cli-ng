import { Clingy } from "../src/Clingy";
import { ICommand } from "../src/command/ICommand";
import { CommandMap } from "../src/command/CommandMap";

const createCommand = (): ICommand => {
    return {
        fn: () => null,
        alias: [],
        args: []
    };
};

/**
 * Tests for {@link Clingy}.
 */
describe("Clingy", () => {

    it("Asserts that Clingy constructs with a CommandMap.", () => {
        const commandName = "foo";
        const command = createCommand();
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);
        const clingy = new Clingy(commandMap);

        expect(clingy.getCommand(commandName)).toBe(command);
    });

    it("Asserts that Clingy constructs with sub-commands.", () => {
        const commandName2 = "foo";
        const command2: ICommand = createCommand();
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy2 = new Clingy(commandMap2);

        const commandName1 = "foo";
        const command1 = createCommand();
        command1.sub = clingy2;
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const clingy1 = new Clingy(commandMap1);

        const mapEntry = <ICommand>clingy1.getCommand(commandName1);
        expect(mapEntry).toBe(command1);
        expect((<Clingy>mapEntry.sub).getCommand(commandName2)).toBe(command2);
    });

    it("Asserts that Clingy updates the internal aliased map.", () => {
        const commandName = "foo";
        const commandAlias1 = "fizz";
        const commandAlias2 = "fuu";
        const command = createCommand();
        command.alias = [commandAlias1, commandAlias2];
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);
        const clingy = new Clingy(commandMap);

        expect(clingy.getCommand(commandName)).toBe(command);
        expect(clingy.getCommand(commandAlias1)).toBe(command);
        expect(clingy.getCommand(commandAlias2)).toBe(command);
    });

    it("Asserts that Clingy updates the internal aliased map while skipping duplicate keys.", () => {
        const commandName1 = "foo";
        const commandName2 = "bar";
        const commandAlias1 = "fizz";
        const command1 = createCommand();
        command1.alias = [commandAlias1];
        const command2 = createCommand();
        command2.alias = [commandAlias1];
        const commandMap = new CommandMap();
        commandMap.set(commandName1, command1);
        commandMap.set(commandName2, command2);
        const clingy = new Clingy(commandMap);

        expect(clingy.getCommand(commandName1)).toBe(command1);
        expect(clingy.getCommand(commandName2)).toBe(command2);
        expect(clingy.getCommand(commandAlias1)).toBe(command1);
    });

    it("Asserts that Clingy updates the internal aliased map when modified after construction.", () => {
        const commandName1 = "foo";
        const commandName2 = "bar";
        const commandAlias1 = "fizz";
        const command1 = createCommand();
        command1.alias = [commandAlias1];
        const command2 = createCommand();
        command2.alias = [commandAlias1];
        const clingy = new Clingy(new CommandMap());
        clingy.setCommand(commandName1, command1);
        clingy.setCommand(commandName2, command2);

        expect(clingy.getCommand(commandName1)).toBe(command1);
        expect(clingy.getCommand(commandName2)).toBe(command2);
        expect(clingy.getCommand(commandAlias1)).toBe(command1);
    });
});
