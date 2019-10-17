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
declare class CommandMap extends Map<string, Command> {
    constructor(input?: MapWithCommands | ObjWithCommands);
    /**
     * Creates a new instance with {@link Clingy} options to inherit.
     *
     * @param commands Command input to use.
     * @param options Options for the Clingy instance.
     */
    static createWithOptions(commands: MapWithCommands | ObjWithCommands, options: ClingyOptions): CommandMap;
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
    getCommand(key: string, caseSensitivity: CaseSensitivity): Command | null;
}
export { CommandMap };
//# sourceMappingURL=CommandMap.d.ts.map