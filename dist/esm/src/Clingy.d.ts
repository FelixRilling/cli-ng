import { ClingyOptions } from "./ClingyOptions";
import { Command } from "./command/Command";
import { CommandMap } from "./command/CommandMap";
import { CommandPath } from "./command/CommandPath";
import { MapWithCommands } from "./command/MapWithCommands";
import { ObjWithCommands } from "./command/ObjWithCommands";
import { LookupResolver } from "./lookup/LookupResolver";
import { LookupResult } from "./lookup/result/LookupResult";
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
    constructor(commands?: MapWithCommands | ObjWithCommands, options?: ClingyOptions);
    /**
     * Sets a command on this instance.
     *
     * @param key Key of the command.
     * @param command The command.
     */
    setCommand(key: string, command: Command): void;
    /**
     * Gets a command from this instance.
     *
     * @param key Key of the command.
     */
    getCommand(key: string): Command | undefined;
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
    hasPath(path: CommandPath): boolean;
    /**
     * Resolves a pathUsed to a command.
     *
     * @param path Path to look up.
     * @return Lookup result, either {@link ILookupSuccess} or {@link ILookupErrorNotFound}.
     */
    getPath(path: CommandPath): LookupResult;
    /**
     * Parses a string into a command and arguments.
     *
     * @param input String to parse.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    parse(input: string): LookupResult;
    /**
     * @private
     */
    updateAliases(): void;
}
export { Clingy };
//# sourceMappingURL=Clingy.d.ts.map