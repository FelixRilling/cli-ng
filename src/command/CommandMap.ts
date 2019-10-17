import { forEach, isMap, isObject, isPlainObject } from "lodash";
import { Clingy } from "../Clingy";
import { ClingyOptions } from "../ClingyOptions";
import { CaseSensitivity } from "../lookup/CaseSensitivity";
import { Command } from "./Command";
import { MapWithCommands } from "./MapWithCommands";
import { ObjWithCommands } from "./ObjWithCommands";

/**
 * Map containing {@link Command}s.
 *
 * @private
 */
class CommandMap extends Map<string, Command> {
    public constructor(input?: MapWithCommands | ObjWithCommands) {
        super(CommandMap.getConstructorMap(input));
    }

    /**
     * Creates a new instance with {@link Clingy} options to inherit.
     *
     * @param commands Command input to use.
     * @param options Options for the Clingy instance.
     */
    public static createWithOptions(
        commands: MapWithCommands | ObjWithCommands,
        options: ClingyOptions
    ): CommandMap {
        if (isMap(commands)) {
            commands.forEach(val =>
                CommandMap.createWithOptionsHelper(val, options)
            );
        } else if (isPlainObject(commands)) {
            forEach(commands, val =>
                CommandMap.createWithOptionsHelper(val, options)
            );
        }

        return new CommandMap(commands);
    }

    private static createWithOptionsHelper(
        command: Command,
        options: ClingyOptions
    ): void {
        if (isPlainObject(command.sub) || isMap(command.sub)) {
            command.sub = new Clingy(
                CommandMap.createWithOptions(
                    <MapWithCommands>command.sub,
                    options
                ),
                options
            );
        }
    }

    private static getConstructorMap(
        input?: MapWithCommands | ObjWithCommands
    ): ReadonlyArray<[string, Command]> | null {
        if (isMap(input)) {
            return Array.from(input.entries());
        }
        if (isObject(input)) {
            return Array.from(Object.entries(<object>input));
        }

        return null;
    }

    /**
     * Checks if the map contains a key, ignoring case.
     *
     * @param key Key to check for.
     * @param caseSensitivity Case sensitivity to use.
     * @return If the map contains a key, ignoring case.
     */
    public hasCommand(key: string, caseSensitivity: CaseSensitivity): boolean {
        if (caseSensitivity === CaseSensitivity.INSENSITIVE) {
            return Array.from(this.keys())
                .map(k => k.toLowerCase())
                .includes(key.toLowerCase());
        }

        return this.has(key);
    }

    /**
     * Returns the value for the key, ignoring case.
     *
     * @param key Key to check for.
     * @param caseSensitivity Case sensitivity to use.
     * @return The value for the key, ignoring case.
     */
    public getCommand(
        key: string,
        caseSensitivity: CaseSensitivity
    ): Command | null {
        if (caseSensitivity === CaseSensitivity.INSENSITIVE) {
            let result: Command | null = null;

            this.forEach((value, k) => {
                if (key.toLowerCase() === k.toLowerCase()) {
                    result = value;
                }
            });

            return result;
        }

        // Return null instead of undefined to be backwards compatible.
        return this.has(key) ? <Command>this.get(key) : null;
    }
}

export { CommandMap };
