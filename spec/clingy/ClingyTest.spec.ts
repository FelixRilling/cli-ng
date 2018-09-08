import { Clingy } from "../../src/Clingy";
import { ICommand } from "../../src/command/ICommand";
import { CommandMap } from "../../src/command/CommandMap";

/**
 * Tests for {@link Clingy}.
 */
describe("Clingy", () => {

    it("Asserts that Clingy constructs with a CommandMap.", () => {
        const commandName = "foo";
        const command: ICommand = {
            fn: () => null,
            alias: [],
            args: []
        };
        const commandMap = new CommandMap();
        commandMap.set(commandName, command);
        const clingy = new Clingy(commandMap);

        expect(clingy.getCommand(commandName)).toBe(command);
    });

    it("Asserts that Clingy constructs with sub-commands.", () => {
        const commandName2 = "foo";
        const command2: ICommand = {
            fn: () => null,
            alias: [],
            args: []
        };
        const commandMap2 = new CommandMap();
        commandMap2.set(commandName2, command2);
        const clingy2 = new Clingy(commandMap2);

        const commandName1 = "foo";
        const command1: ICommand = {
            fn: () => null,
            alias: [],
            args: [],
            sub: clingy2
        };
        const commandMap1 = new CommandMap();
        commandMap1.set(commandName1, command1);

        const clingy1 = new Clingy(commandMap1);

        const mapEntry = <ICommand>clingy1.getCommand(commandName1);
        expect(mapEntry).toBe(command1);
        expect((<Clingy>mapEntry.sub).getCommand(commandName2)).toBe(command2);
    });
//
//     /**
//      * Asserts that {@link Clingy} constructs with a {@link CommandMap}.
//      */
// @Test
//     void clingyConstructsWithCommands() {
//         String commandName = "foo";
//         Command command = new Command(null, Collections.emptyList(), null);
//         Map<String, Command> commandMap = new HashMap<>();
//         commandMap.put(commandName, command);
//         Clingy clingy = new Clingy(commandMap);
//
//         assertThat(clingy.getCommand(commandName)).isSameAs(command);
//     }
//
//     /**
//      * Asserts that {@link Clingy} constructs with a sub-commands.
//      */
// @Test
//     void clingyConstructsWithSubCommands() {
//         String commandName2 = "bar";
//         Command command2 = new Command(null, Collections.emptyList(), null);
//         Map<String, Command> commandMap2 = new HashMap<>();
//         commandMap2.put(commandName2, command2);
//         Clingy clingy2 = new Clingy(commandMap2);
//
//         String commandName1 = "foo";
//         Command command1 = new Command(null, Collections.emptyList(), null, null, clingy2);
//         Map<String, Command> commandMap1 = new HashMap<>();
//         commandMap1.put(commandName1, command1);
//         Clingy clingy1 = new Clingy(commandMap1);
//
//         assertThat(clingy1.getCommand(commandName1)).isSameAs(command1);
//         assertThat(clingy1.getCommand(commandName1).getSub().getCommand(commandName2)).isSameAs(command2);
//     }
//
//
//     /**
//      * Asserts that {@link Clingy} updates the internal aliased map.
//      */
// @Test
//     void clingyUpdateAliases() {
//         String commandName = "foo";
//         String alias1 = "bar";
//         String alias2 = "fizz";
//         Command command = new Command(null, Arrays.asList(alias1, alias2), null);
//         Map<String, Command> commandMap = new HashMap<>();
//         commandMap.put(commandName, command);
//         Clingy clingy = new Clingy(commandMap);
//
//         assertThat(clingy.getCommand(commandName)).isSameAs(command);
//         assertThat(clingy.getCommand(alias1)).isSameAs(command);
//         assertThat(clingy.getCommand(alias2)).isSameAs(command);
//     }
//
//     /**
//      * Asserts that {@link Clingy} updates the internal aliased map while skipping duplicate keys.
//      */
// @Test
//     void clingyUpdateAliasesSkipsDuplicateKeys() {
//         String commandName1 = "foo";
//         String commandName2 = "bar";
//         String alias1 = "fizz";
//         Command command1 = new Command(null, Collections.singletonList(alias1), null);
//         Command command2 = new Command(null, Collections.singletonList(commandName1), null);
//         Map<String, Command> commandMap = new HashMap<>();
//         commandMap.put(commandName1, command1);
//         commandMap.put(commandName2, command2);
//         Clingy clingy = new Clingy(commandMap);
//
//         assertThat(clingy.getCommand(commandName1)).isSameAs(command1);
//         assertThat(clingy.getCommand(alias1)).isSameAs(command1);
//         assertThat(clingy.getCommand(commandName2)).isSameAs(command2);
//     }
//
//     /**
//      * Asserts that {@link Clingy} updates the internal aliased map when modified after construction.
//      */
// @Test
//     void clingyUpdateAliasesUpdatesAfterChanges() {
//         String commandName1 = "foo";
//         String commandName2 = "bar";
//         String alias1 = "fizz";
//         Command command1 = new Command(null, Collections.singletonList(alias1), null);
//         Command command2 = new Command(null, Collections.singletonList(commandName1), null);
//         Map<String, Command> commandMap = new HashMap<>();
//         Clingy clingy = new Clingy(commandMap);
//
//         clingy.setCommand(commandName1, command1);
//         clingy.setCommand(commandName2, command2);
//
//         assertThat(clingy.getCommand(commandName1)).isSameAs(command1);
//         assertThat(clingy.getCommand(alias1)).isSameAs(command1);
//         assertThat(clingy.getCommand(commandName2)).isSameAs(command2);
//     }

});
