import { CommandMap } from "./command/CommandMap";
import { commandPath } from "./command/commandPath";
import { ICommand } from "./command/ICommand";
import { IObjWithCommands } from "./command/IObjWithCommands";
import { mapWithCommands } from "./command/mapWithCommands";
import { IClingyOptions } from "./IClingyOptions";
import { LookupResolver } from "./lookup/LookupResolver";
import { ILookupResult } from "./lookup/result/ILookupResult";
import { InputParser } from "./parser/InputParser";
/**
 * Core {@link Clingy} class, entry point for creation of a new instance.
 */
declare class Clingy {
    private static readonly logger;
    readonly lookupResolver: LookupResolver;
    readonly inputParser: InputParser;
    readonly map: CommandMap;
    readonly mapAliased: CommandMap;
    /**
     * Creates a new {@link Clingy} instance.
     *
     * @param commands      Map of commands to create the instance with.
     * @param options       Option object.
     */
    constructor(commands?: mapWithCommands | IObjWithCommands, options?: IClingyOptions);
    /**
     * Sets a command on this instance.
     *
     * @param key Key of the command.
     * @param command The command.
     */
    setCommand(key: string, command: ICommand): void;
    /**
     * Gets a command from this instance.
     *
     * @param key Key of the command.
     */
    getCommand(key: string): ICommand | undefined;
    /**
     * Checks if a command on this instance exists for this key.
     *
     * @param key Key of the command.
     */
    hasCommand(key: string): boolean;
    /**
     * Checks if a pathUsed resolves to a command.
     *
     * @param path Path to look up.
     * @return If the pathUsed resolves to a command.
     */
    hasPath(path: commandPath): boolean;
    /**
     * Resolves a pathUsed to a command.
     *
     * @param path Path to look up.
     * @return Lookup result, either {@link ILookupSuccess} or {@link ILookupErrorNotFound}.
     */
    getPath(path: commandPath): ILookupResult;
    /**
     * Parses a string into a command and arguments.
     *
     * @param input String to parse.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    parse(input: string): ILookupResult;
    /**
     * @private
     */
    updateAliases(): void;
}
export { Clingy };
//# sourceMappingURL=Clingy.d.ts.map