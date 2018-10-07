import { IClingyOptions } from "../IClingyOptions";
import { ICommand } from "./ICommand";
import { IObjWithCommands } from "./IObjWithCommands";
import { mapWithCommands } from "./mapWithCommands";
/**
 * Map containing {@link ICommand}s.
 *
 * @private
 */
declare class CommandMap extends Map<string, ICommand> {
    constructor(input?: mapWithCommands | IObjWithCommands);
    /**
     * Checks if the map contains a key, ignoring case.
     *
     * @param key Key to check for.
     * @return If the map contains a key, ignoring case.
     */
    hasIgnoreCase(key: string): boolean;
    /**
     * Returns the value for the key, ignoring case.
     *
     * @param key Key to check for.
     * @return The value for the key, ignoring case.
     */
    getIgnoreCase(key: string): ICommand | null;
    /**
     * Creates a new instance with {@link Clingy} options to inherit.
     *
     * @param commands Command input to use.
     * @param options Options for the Clingy instance.
     */
    static createWithOptions(commands: mapWithCommands | IObjWithCommands, options: IClingyOptions): CommandMap;
    private static createWithOptionsHelper;
    private static getConstructorMap;
}
export { CommandMap };
