import { ClingyOptions } from "./ClingyOptions";
import { Command } from "./command/Command";
import { CommandMap } from "./command/CommandMap";
import { CommandPath } from "./command/CommandPath";
import { MapWithCommands } from "./command/MapWithCommands";
import { ObjWithCommands } from "./command/ObjWithCommands";
import { clingyLogby } from "./logger";
import { ArgumentResolving } from "./lookup/ArgumentResolving";
import { LookupResolver } from "./lookup/LookupResolver";
import { LookupResult } from "./lookup/result/LookupResult";
import { InputParser } from "./parser/InputParser";

/**
 * Core {@link Clingy} class, entry point for creation of a new instance.
 */
class Clingy {
    private static readonly logger = clingyLogby.getLogger(Clingy);

    public readonly lookupResolver: LookupResolver;
    public readonly inputParser: InputParser;
    public readonly map: CommandMap;
    public readonly mapAliased: CommandMap;

    /**
     * Creates a new {@link Clingy} instance.
     *
     * @param commands      Map of commands to create the instance with.
     * @param options       Option object.
     */
    public constructor(
        commands: MapWithCommands | ObjWithCommands = {},
        options: ClingyOptions = {}
    ) {
        this.lookupResolver = new LookupResolver(options.caseSensitive);
        this.inputParser = new InputParser(options.legalQuotes);
        this.map = CommandMap.createWithOptions(commands, options);
        this.mapAliased = new CommandMap();
        this.updateAliases();
    }

    /**
     * Sets a command on this instance.
     *
     * @param key Key of the command.
     * @param command The command.
     */
    public setCommand(key: string, command: Command): void {
        this.map.set(key, command);
        this.updateAliases();
    }

    // TODO replace .get() with .getCommand() (breaking)
    /**
     * Gets a command from this instance.
     *
     * @param key Key of the command.
     */
    public getCommand(key: string): Command | undefined {
        return this.mapAliased.get(key);
    }

    // Noinspection JSUnusedGlobalSymbols
    // TODO replace .has() with .hasCommand() (breaking)
    /**
     * Checks if a command on this instance exists for this key.
     *
     * @param key Key of the command.
     */
    public hasCommand(key: string): boolean {
        return this.mapAliased.has(key);
    }

    // Noinspection JSUnusedGlobalSymbols
    /**
     * Checks if a pathUsed resolves to a command.
     *
     * @param path Path to look up.
     * @return If the pathUsed resolves to a command.
     */
    public hasPath(path: CommandPath): boolean {
        return this.getPath(path).successful;
    }

    /**
     * Resolves a pathUsed to a command.
     *
     * @param path Path to look up.
     * @return Lookup result, either {@link ILookupSuccess} or {@link ILookupErrorNotFound}.
     */
    public getPath(path: CommandPath): LookupResult {
        Clingy.logger.debug(`Resolving pathUsed: ${path}`);
        return this.lookupResolver.resolve(
            this.mapAliased,
            path,
            ArgumentResolving.IGNORE
        );
    }

    /**
     * Parses a string into a command and arguments.
     *
     * @param input String to parse.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    public parse(input: string): LookupResult {
        Clingy.logger.debug(`Parsing input: '${input}'`);
        return this.lookupResolver.resolve(
            this.mapAliased,
            this.inputParser.parse(input),
            ArgumentResolving.RESOLVE
        );
    }

    /**
     * @private
     */
    public updateAliases(): void {
        Clingy.logger.debug("Updating aliased map.");
        this.mapAliased.clear();

        this.map.forEach((value, key) => {
            this.mapAliased.set(key, value);

            value.alias.forEach(alias => {
                if (this.mapAliased.has(alias)) {
                    Clingy.logger.warn(
                        `Alias '${alias}' conflicts with a previously defined key, will be ignored.`
                    );
                } else {
                    Clingy.logger.trace(
                        `Created alias '${alias}' for '${key}'`
                    );
                    this.mapAliased.set(alias, value);
                }
            });
        });

        Clingy.logger.debug("Done updating aliased map.");
    }
}

export { Clingy };
