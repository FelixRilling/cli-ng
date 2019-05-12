import { IClingyOptions } from "../IClingyOptions";
import { ICommand } from "./ICommand";
import { IObjWithCommands } from "./IObjWithCommands";
import { mapWithCommands } from "./mapWithCommands";
import { CaseSensitivity } from "../lookup/CaseSensitivity";
/**
 * Map containing {@link ICommand}s.
 *
 * @private
 */
declare class CommandMap extends Map<string, ICommand> {
    constructor(input?: mapWithCommands | IObjWithCommands);
    /**
     * Creates a new instance with {@link Clingy} options to inherit.
     *
     * @param commands Command input to use.
     * @param options Options for the Clingy instance.
     */
    static createWithOptions(commands: mapWithCommands | IObjWithCommands, options: IClingyOptions): CommandMap;
    private static createWithOptionsHelper;
    private static getConstructorMap;
    /**
     * Checks if the map contains a key, ignoring case.
     *
     * @param key Key to check for.
     * @param caseSensitivity Case sensitivity to use.
     * @return If the map contains a key, ignoring case.
     */
    hasCommand(key: string, caseSensitivity: CaseSensitivity): boolean;
    /**
     * Returns the value for the key, ignoring case.
     *
     * @param key Key to check for.
     * @param caseSensitivity Case sensitivity to use.
     * @return The value for the key, ignoring case.
     */
    getCommand(key: string, caseSensitivity: CaseSensitivity): ICommand | null;
}
export { CommandMap };
