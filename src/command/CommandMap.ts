import { forEach, isMap, isObject, isPlainObject } from "lodash";
import { Clingy } from "../Clingy";
import { IClingyOptions } from "../IClingyOptions";
import { CaseSensitivity } from "../lookup/CaseSensitivity";
import { ICommand } from "./ICommand";
import { IObjWithCommands } from "./IObjWithCommands";
import { mapWithCommands } from "./mapWithCommands";

/**
 * Map containing {@link ICommand}s.
 *
 * @private
 */
class CommandMap extends Map<string, ICommand> {
    constructor(input?: mapWithCommands | IObjWithCommands) {
        super(CommandMap.getConstructorMap(input));
    }

    /**
     * Creates a new instance with {@link Clingy} options to inherit.
     *
     * @param commands Command input to use.
     * @param options Options for the Clingy instance.
     */
    public static createWithOptions(
        commands: mapWithCommands | IObjWithCommands,
        options: IClingyOptions
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
        command: ICommand,
        options: IClingyOptions
    ) {
        if (isPlainObject(command.sub) || isMap(command.sub)) {
            command.sub = new Clingy(
                CommandMap.createWithOptions(
                    <mapWithCommands>command.sub,
                    options
                ),
                options
            );
        }
    }

    private static getConstructorMap(
        input?: mapWithCommands | IObjWithCommands
    ): ReadonlyArray<[string, ICommand]> | null {
        if (isMap(input)) {
            return Array.from((<mapWithCommands>input).entries());
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
    ): ICommand | null {
        if (caseSensitivity === CaseSensitivity.INSENSITIVE) {
            let result: ICommand | null = null;

            this.forEach((value, k) => {
                if (key.toLowerCase() === k.toLowerCase()) {
                    result = value;
                }
            });

            return result;
        }

        // Return null instead of undefined to be backwards compatible.
        return this.has(key) ? <ICommand>this.get(key) : null;
    }
}

export { CommandMap };
