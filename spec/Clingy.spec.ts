import { Clingy } from "../src/Clingy";
import { ICommand } from "../src/command/ICommand";
import { mapWithCommands } from "../src/command/mapWithCommands";
import { IObjWithCommands } from "../src/command/IObjWithCommands";

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

    it("Asserts that Clingy constructs with a Map.", () => {
        const commandName = "foo";
        const command = createCommand();
        const map: mapWithCommands = new Map();
        map.set(commandName, command);
        const clingy = new Clingy(map);

        expect(clingy.getCommand(commandName)).toBe(command);
    });

    it("Asserts that Clingy constructs with an Object.", () => {
        const commandName = "foo";
        const command = createCommand();
        const obj: IObjWithCommands = {
            [commandName]: command
        };

        const clingy = new Clingy(obj);

        expect(clingy.getCommand(commandName)).toBe(command);
    });


    it("Asserts that Clingy constructs with sub-commands as Clingy instances.", () => {
        const commandName2 = "foo";
        const command2 = createCommand();
        const map2: mapWithCommands = new Map();
        map2.set(commandName2, command2);
        const clingy2 = new Clingy(map2);

        const commandName1 = "foo";
        const command1 = createCommand();
        command1.sub = clingy2;
        const map1: mapWithCommands = new Map();
        map1.set(commandName1, command1);

        const clingy1 = new Clingy(map1);

        const result = <ICommand>clingy1.getCommand(commandName1);
        expect(result).toBe(command1);
        expect((<Clingy>result.sub).getCommand(commandName2)).toBe(command2);
    });

    it("Asserts that Clingy constructs with sub-commands as Maps.", () => {
        const commandName2 = "fizz";
        const command2 = createCommand();
        const map2: mapWithCommands = new Map();
        map2.set(commandName2, command2);

        const commandName1 = "foo";
        const command1 = createCommand();
        command1.sub = map2;
        const map1: mapWithCommands = new Map();
        map1.set(commandName1, command1);

        const clingy1 = new Clingy(map1);

        const result = <ICommand>clingy1.getCommand(commandName1);
        expect(result).toBe(command1);
        expect((<Clingy>result.sub).getCommand(commandName2)).toBe(command2);
    });

    it("Asserts that Clingy constructs with sub-commands as Objects.", () => {
        const commandName2 = "fizz";
        const command2 = createCommand();
        const obj2: IObjWithCommands = {
            [commandName2]: command2
        };

        const commandName1 = "foo";
        const command1 = createCommand();
        command1.sub = obj2;
        const map1: mapWithCommands = new Map();
        map1.set(commandName1, command1);

        const clingy1 = new Clingy(map1);

        const result = <ICommand>clingy1.getCommand(commandName1);
        expect(result).toBe(command1);
        expect((<Clingy>result.sub).getCommand(commandName2)).toBe(command2);
    });

    it("Asserts that Clingy constructs with nested sub-commands.", () => {
        const commandName3 = "fazz";
        const command3 = createCommand();
        const map3: mapWithCommands = new Map();
        map3.set(commandName3, command3);

        const commandName2 = "fizz";
        const command2 = createCommand();
        command2.sub = map3;
        const obj2: IObjWithCommands = {
            [commandName2]: command2
        };

        const commandName1 = "foo";
        const command1 = createCommand();
        command1.sub = obj2;
        const map1: mapWithCommands = new Map();
        map1.set(commandName1, command1);

        const clingy1 = new Clingy(map1);

        const result1 = <ICommand>clingy1.getCommand(commandName1);
        expect(result1).toBe(command1);
        const result2 = (<Clingy>result1.sub).getCommand(commandName2);
        expect(result2).toBe(command2);
        expect((<Clingy>result2!.sub).getCommand(commandName3)).toBe(command3);
    });

    it("Asserts that Clingy updates the internal aliased map.", () => {
        const commandName = "foo";
        const commandAlias1 = "fizz";
        const commandAlias2 = "fuu";
        const command = createCommand();
        command.alias = [commandAlias1, commandAlias2];
        const map: mapWithCommands = new Map();
        map.set(commandName, command);
        const clingy = new Clingy(map);

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
        const map: mapWithCommands = new Map();
        map.set(commandName1, command1);
        map.set(commandName2, command2);
        const clingy = new Clingy(map);

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
        const clingy = new Clingy();
        clingy.setCommand(commandName1, command1);
        clingy.setCommand(commandName2, command2);

        expect(clingy.getCommand(commandName1)).toBe(command1);
        expect(clingy.getCommand(commandName2)).toBe(command2);
        expect(clingy.getCommand(commandAlias1)).toBe(command1);
    });
});
