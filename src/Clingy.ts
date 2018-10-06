import { CommandMap } from "./command/CommandMap";
import { commandPath } from "./command/commandPath";
import { ICommand } from "./command/ICommand";
import { IObjWithCommands } from "./command/IObjWithCommands";
import { mapWithCommands } from "./command/mapWithCommands";
import { IClingyOptions } from "./IClingyOptions";
import { clingyLogby } from "./logger";
import { LookupResolver } from "./lookup/LookupResolver";
import { ILookupResult } from "./lookup/result/ILookupResult";
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
    constructor(
        commands: mapWithCommands | IObjWithCommands = {},
        options: IClingyOptions = {}
    ) {
        this.lookupResolver = new LookupResolver(options.caseSensitive);
        this.inputParser = new InputParser(options.legalQuotes);
        this.map = CommandMap.createWithOptions(commands, options);
        this.mapAliased = new CommandMap();
        this.updateAliases();
    }

    public setCommand(key: string, command: ICommand): void {
        this.map.set(key, command);
        this.updateAliases();
    }

    public getCommand(key: string): ICommand | undefined {
        return this.mapAliased.get(key);
    }

    public hasCommand(key: string): boolean {
        return this.mapAliased.has(key);
    }

    /**
     * Checks if a pathUsed resolves to a command.
     *
     * @param path Path to look up.
     * @return If the pathUsed resolves to a command.
     */
    public hasPath(path: commandPath): boolean {
        return this.getPath(path).successful;
    }

    /**
     * Resolves a pathUsed to a command.
     *
     * @param path Path to look up.
     * @return Lookup result, either {@link ILookupSuccess} or {@link ILookupErrorNotFound}.
     */
    public getPath(path: commandPath): ILookupResult {
        Clingy.logger.debug(`Resolving pathUsed: ${path}`);
        return this.lookupResolver.resolve(this.mapAliased, path);
    }

    /**
     * Parses a string into a command and arguments.
     *
     * @param input String to parse.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    public parse(input: string): ILookupResult {
        Clingy.logger.debug(`Parsing input: '${input}'`);
        return this.lookupResolver.resolve(
            this.mapAliased,
            this.inputParser.parse(input),
            true
        );
    }

    /**
     * @private
     */
    public updateAliases() {
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
