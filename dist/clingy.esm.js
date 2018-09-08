import { isMap, isObject, isString, strSimilar, isNil } from 'lightdash';

const getConstructorMap = (input) => {
    if (isMap(input)) {
        return Array.from(input.entries());
    }
    else if (isObject(input)) {
        return Array.from(Object.entries(input));
    }
    return null;
};
/**
 * Map containing {@link ICommand}s.
 */
class CommandMap extends Map {
    constructor(input) {
        super(getConstructorMap(input));
    }
    /**
     * Checks if the map contains a key, ignoring case.
     *
     * @param key Key to check for.
     * @return If the map contains a key, ignoring case.
     */
    hasIgnoreCase(key) {
        return Array.from(this.keys())
            .map(k => k.toLowerCase())
            .includes(key.toLowerCase());
    }
    /**
     * Returns the value for the key, ignoring case.
     *
     * @param key Key to check for.
     * @return The value for the key, ignoring case.
     */
    getIgnoreCase(key) {
        let result = null;
        this.forEach((value, k) => {
            if (key.toLowerCase() === k.toLowerCase()) {
                result = value;
            }
        });
        return result;
    }
}

var Level;
(function (Level) {
    Level[Level["ERROR"] = 0] = "ERROR";
    Level[Level["WARN"] = 1] = "WARN";
    Level[Level["INFO"] = 2] = "INFO";
    Level[Level["DEBUG"] = 3] = "DEBUG";
    Level[Level["TRACE"] = 4] = "TRACE";
})(Level || (Level = {}));
class Logger {
    constructor(name, instance) {
        this.name = name;
        this.instance = instance;
    }
    error(...args) {
        this.log(Level.ERROR, "ERROR", "error", args);
    }
    warn(...args) {
        this.log(Level.WARN, "WARN", "warn", args);
    }
    info(...args) {
        this.log(Level.INFO, "INFO", "info", args);
    }
    debug(...args) {
        this.log(Level.DEBUG, "DEBUG", "log", args);
    }
    trace(...args) {
        this.log(Level.TRACE, "TRACE", "log", args);
    }
    log(levelValue, levelName, outMethod, args) {
        if (this.instance.level >= levelValue) {
            this.instance.stdout[outMethod](`${new Date().toISOString()} ${levelName} ${this.name} -`, ...args);
        }
    }
}
class Logaloo {
    /**
     * Creates a new logger module.
     *
     * @param level Level of this modules loggers.
     * @param stdout output stream to use, defaults to console
     */
    constructor(level = Level.INFO, stdout = console) {
        this.loggerMap = new Map();
        this.level = level;
        this.stdout = stdout;
    }
    /**
     * Get a logger instance.
     *
     * @param nameable A string or a INameable (ex: class, function).
     * @returns The Logger instance.
     */
    getLogger(nameable) {
        let name;
        if ("name" in nameable) {
            name = nameable.name;
        }
        else if (isString(nameable)) {
            name = nameable;
        }
        else {
            throw new TypeError(`'${nameable}' is neither an INameable nor a string.`);
        }
        if (this.loggerMap.has(name)) {
            return this.loggerMap.get(name);
        }
        const logger = new Logger(name, this);
        this.loggerMap.set(name, logger);
        return logger;
    }
}

// TODO make this configurable
const logaloo = new Logaloo();

/**
 * Orchestrates mapping of {@link IArgument}s to user-provided input.
 */
class ArgumentMatcher {
    /**
     * Matches a list of {@link IArgument}s to a list of string input arguments.
     *
     * @param expected {@link Argument} list of a {@link ICommand}
     * @param provided List of user-provided arguments.
     */
    constructor(expected, provided) {
        this.missing = [];
        this.result = new Map();
        const logger = logaloo.getLogger(ArgumentMatcher);
        logger.debug(`Matching arguments ${expected} with ${provided}`);
        expected.forEach((expectedArg, i) => {
            if (i < provided.length) {
                const providedArg = provided[i];
                logger.trace(`Found matching argument for ${expectedArg.name}, adding to result: ${providedArg}`);
                this.result.set(expectedArg.name, providedArg);
            }
            else if (!expectedArg.required &&
                expectedArg.defaultValue != null) {
                logger.trace(`No matching argument found for ${expectedArg.name}, using default: ${expectedArg.defaultValue}`);
                this.result.set(expectedArg.name, expectedArg.defaultValue);
            }
            else {
                logger.trace(`No matching argument found for ${expectedArg.name}, adding to missing.`);
                this.missing.push(expectedArg);
            }
        });
        logger.debug(`Finished matching arguments: ${expected.length} expected, ${this.result.size} found and ${this.missing.length} missing.`);
    }
}

/**
 * Gets similar keys of a key based on their string distance.
 *
 * @param mapAliased Map to use for lookup.
 * @param name       Key to use.
 * @return List of similar keys.
 */
const getSimilar = (mapAliased, name) => strSimilar(name, Array.from(mapAliased.keys()), false);

/**
 * Lookup tools for resolving paths through {@link CommandMap}s.
 */
class LookupResolver {
    /**
     * Creates a new {@link LookupResolver}.
     *
     * @param caseSensitive If the lookup should honor case.
     */
    constructor(caseSensitive = true) {
        this.logger = logaloo.getLogger(LookupResolver);
        this.caseSensitive = caseSensitive;
    }
    /**
     * Resolves a pathUsed through a {@link CommandMap}.
     *
     * @param mapAliased     Map to use.
     * @param path           Path to getPath.
     * @param parseArguments If dangling pathUsed items should be treated as arguments.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    resolve(mapAliased, path, parseArguments = false) {
        return this.resolveInternal(mapAliased, path, [], parseArguments);
    }
    resolveInternal(mapAliased, path, pathUsed, parseArguments) {
        if (path.length === 0) {
            throw new Error("Path cannot be empty.");
        }
        const currentPathFragment = path[0];
        const pathNew = path.slice(1);
        pathUsed.push(currentPathFragment);
        if (this.caseSensitive
            ? !mapAliased.has(currentPathFragment)
            : !mapAliased.hasIgnoreCase(currentPathFragment)) {
            this.logger.warn(`Command '${currentPathFragment}' could not be found.`);
            return {
                successful: false,
                pathUsed,
                pathDangling: pathNew,
                type: 1 /* ERROR_NOT_FOUND */,
                missing: currentPathFragment,
                similar: getSimilar(mapAliased, currentPathFragment)
            };
        }
        const command = ((this.caseSensitive
            ? mapAliased.get(currentPathFragment)
            : mapAliased.getIgnoreCase(currentPathFragment)));
        this.logger.debug(`Successfully looked up command: ${currentPathFragment}`);
        let argumentsResolved;
        if (!parseArguments ||
            isNil(command.args) ||
            command.args.length === 0) {
            this.logger.debug("No arguments defined, using empty list.");
            argumentsResolved = new Map();
        }
        else {
            this.logger.debug(`Looking up arguments: ${pathNew}`);
            const argumentMatcher = new ArgumentMatcher(command.args, pathNew);
            if (argumentMatcher.missing.length > 0) {
                this.logger.warn(`Some arguments could not be found: ${argumentMatcher.missing}`);
                return {
                    successful: false,
                    pathUsed,
                    pathDangling: pathNew,
                    type: 2 /* ERROR_MISSING_ARGUMENT */,
                    missing: argumentMatcher.missing
                };
            }
            argumentsResolved = argumentMatcher.result;
            this.logger.debug(`Successfully looked up arguments: ${argumentsResolved}`);
        }
        const lookupSuccess = {
            successful: true,
            pathUsed,
            pathDangling: pathNew,
            type: 0 /* SUCCESS */,
            command,
            args: argumentsResolved
        };
        this.logger.debug(`Returning successful lookup result: ${lookupSuccess}`);
        return lookupSuccess;
    }
}

/**
 * Manages parsing input strings into a pathUsed list.
 */
class InputParser {
    /**
     * Creates an {@link InputParser}.
     *
     * @param legalQuotes List of quotes to use when parsing strings.
     */
    constructor(legalQuotes = ['"']) {
        this.logger = logaloo.getLogger(InputParser);
        this.legalQuotes = legalQuotes;
        this.pattern = this.generateMatcher();
    }
    /**
     * Parses an input string.
     *
     * @param input Input string to parse.
     * @return Path list.
     */
    parse(input) {
        this.logger.debug(`Parsing input '${input}'`);
        return Array.from(input.match(this.pattern));
    }
    generateMatcher() {
        const matchBase = "(\\S+)";
        this.logger.debug("Creating matcher.");
        const matchItems = this.legalQuotes
            .map((str) => `\\Q${str}\\E`)
            .map(quote => `${quote}(.+?)${quote}`);
        matchItems.push(matchBase);
        let result;
        try {
            result = new RegExp(matchItems.join("|"), "g");
        }
        catch (e) {
            this.logger.error("The parsing pattern is invalid, this should never happen.", e);
            throw e;
        }
        console.error(result);
        return result;
    }
}

/**
 * Core {@link Clingy} class, entry point for creation of a new instance.
 */
class Clingy {
    /**
     * Creates a new {@link Clingy} instance.
     *
     * @param commands      Map of commands to create the instance with.
     * @param caseSensitive If commands names should be treated as case sensitive during lookup.
     * @param legalQuotes   List of quotes to use when parsing strings.
     */
    constructor(commands = new Map(), caseSensitive = true, legalQuotes = ["\""]) {
        this.loggerModule = logaloo;
        this.logger = logaloo.getLogger(Clingy);
        this.lookupResolver = new LookupResolver(caseSensitive);
        this.inputParser = new InputParser(legalQuotes);
        this.map = new CommandMap(commands);
        this.mapAliased = new CommandMap();
        this.updateAliases();
    }
    setCommand(key, command) {
        this.map.set(key, command);
        this.updateAliases();
    }
    getCommand(key) {
        return this.mapAliased.get(key);
    }
    hasCommand(key) {
        return this.mapAliased.has(key);
    }
    /**
     * Checks if a pathUsed resolves to a command.
     *
     * @param path Path to look up.
     * @return If the pathUsed resolves to a command.
     */
    hasPath(path) {
        const lookupResult = this.getPath(path);
        return lookupResult != null && lookupResult.successful;
    }
    /**
     * Resolves a pathUsed to a command.
     *
     * @param path Path to look up.
     * @return Lookup result, either {@link ILookupSuccess} or {@link ILookupErrorNotFound}.
     */
    getPath(path) {
        this.logger.debug(`Resolving pathUsed: ${path}`);
        return this.lookupResolver.resolve(this.mapAliased, path);
    }
    /**
     * Parses a string into a command and arguments.
     *
     * @param input String to parse.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    parse(input) {
        this.logger.debug(`Parsing input: '${input}'`);
        return this.lookupResolver.resolve(this.mapAliased, this.inputParser.parse(input), true);
    }
    /**
     * @private
     */
    updateAliases() {
        this.logger.debug("Updating aliased map.");
        this.mapAliased.clear();
        this.map.forEach((value, key) => {
            this.mapAliased.set(key, value);
            value.alias.forEach(alias => {
                if (this.mapAliased.has(alias)) {
                    this.logger.warn(`Alias '${alias}' conflicts with a previously defined key, will be ignored.`);
                }
                else {
                    this.logger.trace(`Created alias '${alias}' for '${key}'`);
                    this.mapAliased.set(alias, value);
                }
            });
        });
        this.logger.debug("Done updating aliased map.");
    }
}

export { Clingy };
