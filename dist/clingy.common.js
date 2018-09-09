'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lightdash = require('lightdash');

const getConstructorMap = (input) => {
    if (lightdash.isMap(input)) {
        return Array.from(input.entries());
    }
    else if (lightdash.isObject(input)) {
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

/**
 * Default level-list.
 */
const Level = {
    NONE: {
        val: -1,
        name: ""
    },
    ERROR: {
        val: 0,
        name: "ERROR"
    },
    WARN: {
        val: 1,
        name: "WARN"
    },
    INFO: {
        val: 2,
        name: "INFO"
    },
    DEBUG: {
        val: 3,
        name: "DEBUG"
    },
    TRACE: {
        val: 4,
        name: "TRACE"
    }
};
/**
 * Logger class.
 */
class Logger {
    /**
     * Creates a new {@link Logger}.
     * Should not be constructed directly, rather use {@link Logaloo.getLogger}
     *
     * @param root Root logger of this logger.
     * @param name Name of the logger.
     */
    constructor(root, name) {
        this.root = root;
        this.name = name;
    }
    /**
     * Logs a message.
     *
     * @param level Level of the log.
     * @param args arguments to be logged.
     */
    log(level, ...args) {
        if (this.root.level.val >= level.val) {
            this.root.outFn(`${new Date().toISOString()} ${level.name} ${this.name} - ${args[0]}`, ...args.slice(1));
        }
    }
    /**
     * Logs an error.
     *
     * @param args arguments to be logged.
     */
    error(...args) {
        this.log(Level.ERROR, args);
    }
    /**
     * Logs a warning.
     *
     * @param args arguments to be logged.
     */
    warn(...args) {
        this.log(Level.WARN, args);
    }
    /**
     * Logs an info.
     *
     * @param args arguments to be logged.
     */
    info(...args) {
        this.log(Level.INFO, args);
    }
    /**
     * Logs a debug message.
     *
     * @param args arguments to be logged.
     */
    debug(...args) {
        this.log(Level.DEBUG, args);
    }
    /**
     * Logs a trace message.
     *
     * @param args arguments to be logged.
     */
    trace(...args) {
        this.log(Level.TRACE, args);
    }
}
/**
 * Logger-root class.
 */
class Logaloo {
    /**
     * Creates a new logger module.
     *
     * @param level Level of this logger-root loggers.
     * @param outFn output function to use, defaults to console.log
     */
    constructor(level = Level.INFO, outFn = console.log) {
        this.loggerMap = new Map();
        this.level = level;
        this.outFn = outFn;
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
        else if (lightdash.isString(nameable)) {
            name = nameable;
        }
        else {
            throw new TypeError(`'${nameable}' is neither an INameable nor a string.`);
        }
        if (this.loggerMap.has(name)) {
            return this.loggerMap.get(name);
        }
        const logger = new Logger(this, name);
        this.loggerMap.set(name, logger);
        return logger;
    }
}

const clingyLoggerRoot = new Logaloo();

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
        const logger = clingyLoggerRoot.getLogger(ArgumentMatcher);
        logger.debug(`Matching arguments ${expected} with ${provided}`);
        expected.forEach((expectedArg, i) => {
            if (i < provided.length) {
                const providedArg = provided[i];
                logger.trace(`Found matching argument for ${expectedArg.name}, adding to result: ${providedArg}`);
                this.result.set(expectedArg.name, providedArg);
            }
            else if (!expectedArg.required &&
                !lightdash.isNil(expectedArg.defaultValue)) {
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
const getSimilar = (mapAliased, name) => lightdash.strSimilar(name, Array.from(mapAliased.keys()), false);

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
        this.logger = clingyLoggerRoot.getLogger(LookupResolver);
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
            lightdash.isNil(command.args) ||
            command.args.length === 0) {
            this.logger.debug("No arguments defined, using empty list.");
            argumentsResolved = new Map();
        }
        else {
            this.logger.debug(`Looking up arguments: ${pathNew}`);
            const argumentMatcher = new ArgumentMatcher(command.args, pathNew);
            if (argumentMatcher.missing.length > 0) {
                this.logger.warn(`Some arguments could not be found: ${argumentMatcher.missing.map(arg => arg.name)}`);
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
 * Manages parsing input strings into a path list.
 */
class InputParser {
    /**
     * Creates an {@link InputParser}.
     *
     * @param legalQuotes List of quotes to use when parsing strings.
     */
    constructor(legalQuotes = ['"']) {
        this.logger = clingyLoggerRoot.getLogger(InputParser);
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
        const result = [];
        const pattern = new RegExp(this.pattern);
        let match;
        // noinspection AssignmentResultUsedJS
        while ((match = pattern.exec(input))) {
            this.logger.trace(`Found match '${match}'`);
            const groups = lightdash.arrCompact(match.slice(1));
            if (groups.length > 0) {
                this.logger.trace(`Found group '${groups[0]}'`);
                result.push(groups[0]);
            }
        }
        return result;
    }
    generateMatcher() {
        this.logger.debug("Creating matcher.");
        const matchBase = "(\\S+)";
        const matchItems = this.legalQuotes
            .map((str) => `\\${str}`)
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
    constructor(commands = new Map(), caseSensitive = true, legalQuotes = ['"']) {
        this.loggerRoot = clingyLoggerRoot;
        this.logger = clingyLoggerRoot.getLogger(Clingy);
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
        return this.getPath(path).successful;
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

exports.Clingy = Clingy;
