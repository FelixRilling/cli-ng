import { CommandMap } from "./command/CommandMap";
import { clingyLogby } from "./logger";
import { ArgumentResolving } from "./lookup/ArgumentResolving";
import { LookupResolver } from "./lookup/LookupResolver";
import { InputParser } from "./parser/InputParser";
/**
 * Core {@link Clingy} class, entry point for creation of a new instance.
 */
class Clingy {
    /**
     * Creates a new {@link Clingy} instance.
     *
     * @param commands      Map of commands to create the instance with.
     * @param options       Option object.
     */
    constructor(commands = {}, options = {}) {
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
    setCommand(key, command) {
        this.map.set(key, command);
        this.updateAliases();
    }
    // TODO replace .get() with .getCommand() (breaking)
    /**
     * Gets a command from this instance.
     *
     * @param key Key of the command.
     */
    getCommand(key) {
        return this.mapAliased.get(key);
    }
    // Noinspection JSUnusedGlobalSymbols
    // TODO replace .has() with .hasCommand() (breaking)
    /**
     * Checks if a command on this instance exists for this key.
     *
     * @param key Key of the command.
     */
    hasCommand(key) {
        return this.mapAliased.has(key);
    }
    // Noinspection JSUnusedGlobalSymbols
    /**
     * Checks if a pathUsed resolves to a command.
     *
     * @param path Path to look up.
     * @return If the pathUsed resolves to a command.
     */
    hasPath(path) {
        return this.getPath(path).successful;
    }
    /**
     * Resolves a pathUsed to a command.
     *
     * @param path Path to look up.
     * @return Lookup result, either {@link ILookupSuccess} or {@link ILookupErrorNotFound}.
     */
    getPath(path) {
        Clingy.logger.debug(`Resolving pathUsed: ${path}`);
        return this.lookupResolver.resolve(this.mapAliased, path, ArgumentResolving.IGNORE);
    }
    /**
     * Parses a string into a command and arguments.
     *
     * @param input String to parse.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    parse(input) {
        Clingy.logger.debug(`Parsing input: '${input}'`);
        return this.lookupResolver.resolve(this.mapAliased, this.inputParser.parse(input), ArgumentResolving.RESOLVE);
    }
    /**
     * @private
     */
    updateAliases() {
        Clingy.logger.debug("Updating aliased map.");
        this.mapAliased.clear();
        this.map.forEach((value, key) => {
            this.mapAliased.set(key, value);
            value.alias.forEach(alias => {
                if (this.mapAliased.has(alias)) {
                    Clingy.logger.warn(`Alias '${alias}' conflicts with a previously defined key, will be ignored.`);
                }
                else {
                    Clingy.logger.trace(`Created alias '${alias}' for '${key}'`);
                    this.mapAliased.set(alias, value);
                }
            });
        });
        Clingy.logger.debug("Done updating aliased map.");
    }
}
Clingy.logger = clingyLogby.getLogger(Clingy);
export { Clingy };
//# sourceMappingURL=Clingy.js.map