var Clingy = (function () {
    'use strict';

    /**
     * Map containing {@link ICommand}s.
     */
    class CommandMap extends Map {
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

    var Levels;
    (function (Levels) {
        Levels[Levels["ERROR"] = 0] = "ERROR";
        Levels[Levels["WARN"] = 1] = "WARN";
        Levels[Levels["INFO"] = 2] = "INFO";
        Levels[Levels["DEBUG"] = 3] = "DEBUG";
        Levels[Levels["TRACE"] = 4] = "TRACE";
    })(Levels || (Levels = {}));
    // tslint:disable-next-line
    let level = Levels.INFO;
    const stdout = console;
    class Logger {
        constructor(name) {
            this.name = name;
        }
        error(...args) {
            if (level >= Levels.ERROR) {
                stdout.error(this.getPrefix("ERROR"), ...args);
            }
        }
        warn(...args) {
            if (level >= Levels.WARN) {
                stdout.warn(this.getPrefix("WARN"), ...args);
            }
        }
        info(...args) {
            if (level >= Levels.INFO) {
                stdout.info(this.getPrefix("INFO"), ...args);
            }
        }
        debug(...args) {
            if (level >= Levels.DEBUG) {
                stdout.log(this.getPrefix("DEBUG"), ...args);
            }
        }
        trace(...args) {
            if (level >= Levels.TRACE) {
                stdout.log(this.getPrefix("TRACE"), ...args);
            }
        }
        getPrefix(messageLevel) {
            return `${new Date().toISOString()} ${messageLevel} ${this.name} - `;
        }
    }
    const logaloo = {
        /**
         * Currently active logging level.
         */
        level,
        /**
         * Get a logger instance.
         *
         * @param name A string or a INameable (ex: class, function).
         * @returns The Logger instance.
         */
        getLogger: (name) => new Logger("name" in name ? name.name : name)
    };

    /**
     * Checks if the value has a certain type-string.
     *
     * @function isTypeOf
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @param {string} type
     * @returns {boolean}
     * @example
     * isTypeOf({}, "object")
     * // => true
     *
     * isTypeOf([], "object")
     * // => true
     *
     * isTypeOf("foo", "string")
     * // => true
     *
     * @example
     * isTypeOf("foo", "number")
     * // => false
     */

    /**
     * Checks if a value is undefined or null.
     *
     * @function isNil
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @returns {boolean}
     * @example
     * isNil(null)
     * // => true
     *
     * isNil(undefined)
     * // => true
     *
     * @example
     * isNil(0)
     * // => false
     *
     * isNil("")
     * // => false
     */
    const isNil = (val) => val == null;

    /**
     * Returns levenshtein string distance of two strings.
     *
     * @function strDistance
     * @memberof String
     * @since 6.3.0
     * @param {string} str1
     * @param {string} str2
     * @returns {number}
     * @example
     * strDistance("Kitten", "Sitting")
     * // => 3
     *
     * strDistance("String", "Stribng")
     * // => 1
     *
     * strDistance("foo", "foo")
     * // => 0
     */
    const strDistance = (str1, str2) => {
        // Cache string length
        const str1Length = str1.length;
        const str2Length = str2.length;
        if (str1Length === 0) {
            // Exit early if str1 is empty
            return str2Length;
        }
        if (str2Length === 0) {
            // Exit early if str2 is empty
            return str1Length;
        }
        // Create matrix that is (str2.length+1)x(str1.length+1) fields
        const matrix = [];
        // Increment along the first column of each row
        for (let y = 0; y <= str2Length; y++) {
            matrix[y] = [y];
        }
        // Increment each column in the first row
        for (let x = 0; x <= str1Length; x++) {
            matrix[0][x] = x;
        }
        // Fill matrix
        for (let y = 1; y <= str2Length; y++) {
            const matrixColumnCurrent = matrix[y];
            const matrixColumnLast = matrix[y - 1];
            for (let x = 1; x <= str1Length; x++) {
                if (str2.charAt(y - 1) === str1.charAt(x - 1)) {
                    // Check if letter at the position is the same
                    matrixColumnCurrent[x] = matrixColumnLast[x - 1];
                }
                else {
                    // Check for substitution/insertion/deletion
                    const substitution = matrixColumnLast[x - 1] + 1;
                    const insertion = matrixColumnCurrent[x - 1] + 1;
                    const deletion = matrixColumnLast[x] + 1;
                    // Get smallest of the three
                    matrixColumnCurrent[x] = Math.min(substitution, insertion, deletion);
                }
            }
        }
        // Return max value
        return matrix[str2Length][str1Length];
    };

    /**
     * Collects the values of an array in a Map as arrays.
     *
     * @function arrCollect
     * @memberof Array
     * @since 6.1.0
     * @param {any[]} arr
     * @param {function} fn fn(val: any, index: number, arr: any[])
     * @returns {Map<any, any[]>} Map<val: any, arr: any[]>
     * @example
     * arrCollect([1, 2, 3, 4, 5], val => val % 2)
     * // => Map<any, any[]>{0: [2, 4], 1: [1, 3, 5]}
     */
    const arrCollect = (arr, fn) => {
        const result = new Map();
        arr.forEach((val, index) => {
            const key = fn(val, index, arr);
            result.set(key, result.has(key) ? [...result.get(key), val] : [val]);
        });
        return result;
    };

    /**
     * Returns strings similar to the input based on the list given.
     *
     * @function strSimilar
     * @memberof String
     * @since 6.3.0
     * @param {string} str
     * @param {Array<string>} list
     * @param {boolean} [returnFull=false]
     * @returns {Array<string>|Map<number,string[]>}
     * @example
     * strSimilar("Fob", ["Foo", "Bar"])
     * // => ["Foo"]
     *
     * strSimilar("cmmit", ["init", "commit", "push"])
     * // => ["commit"]
     *
     * strSimilar("Kitten", ["Sitten", "Sitting", "Bitten"])
     * // => ["Sitten", "Bitten"]
     *
     * strSimilar("cmmit", ["init", "commit", "push"], true)
     * // => Map<number, string[]>{"1": ["commit"], "3": ["init"], "5": ["push"]}
     */
    const strSimilar = (str, list, returnFull = false) => {
        const result = arrCollect(list, val => strDistance(str, val));
        return returnFull
            ? result
            : result.get(Math.min(...result.keys()));
    };

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
            logger.debug("Matching arguments {} with {}", expected, provided);
            expected.forEach((expectedArg, i) => {
                if (i < provided.length) {
                    logger.trace("Found matching argument for {}, adding to result: {}", expectedArg.name, provided[i]);
                    this.result.set(expectedArg.name, provided[i]);
                }
                else if (!expectedArg.required) {
                    logger.trace("No matching argument found for {}, using default: {}", expectedArg.name, expectedArg.defaultValue);
                    this.result.set(expectedArg.name, expectedArg.defaultValue);
                }
                else {
                    logger.trace("No matching argument found for {}, adding to missing.", expectedArg.name);
                    this.missing.push(expectedArg);
                }
            });
            logger.debug("Finished matching arguments: {} expected, {} found and {} missing.", expected.length, this.result.size, this.missing.length);
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
        resolveInternal(mapAliased, path, pathUsed, parseArguments = false) {
            if (path.length === 0) {
                throw new Error("Path cannot be empty.");
            }
            const currentPathFragment = path[0];
            const pathNew = path.slice(1);
            pathUsed.push(currentPathFragment);
            if (this.caseSensitive
                ? !mapAliased.has(currentPathFragment)
                : !mapAliased.hasIgnoreCase(currentPathFragment)) {
                this.logger.warn("Command '{}' could not be found.", currentPathFragment);
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
            this.logger.debug("Successfully looked up command: {}", currentPathFragment);
            let argumentsResolved;
            if (!parseArguments ||
                isNil(command.args) ||
                command.args.length === 0) {
                this.logger.debug("No arguments defined, using empty list.");
                argumentsResolved = new Map();
            }
            else {
                this.logger.debug("Looking up arguments: {}", pathNew);
                const argumentMatcher = new ArgumentMatcher(command.args, pathNew);
                if (argumentMatcher.missing.length > 0) {
                    this.logger.warn("Some arguments could not be found: {}", argumentMatcher.missing);
                    return {
                        successful: false,
                        pathUsed,
                        pathDangling: pathNew,
                        type: 2 /* ERROR_MISSING_ARGUMENT */,
                        missing: argumentMatcher.missing
                    };
                }
                argumentsResolved = argumentMatcher.result;
                this.logger.debug("Successfully looked up arguments: {}", argumentsResolved);
            }
            const lookupSuccess = {
                successful: true,
                pathUsed,
                pathDangling: pathNew,
                type: 0 /* SUCCESS */,
                command,
                args: argumentsResolved
            };
            this.logger.debug("Returning successful lookup result: {}", lookupSuccess);
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
            this.logger.debug("Parsing input '{}'", input);
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
                result = new RegExp(matchItems.join("|"), "");
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
        constructor(commands = new CommandMap(), caseSensitive = true, legalQuotes = ["\""]) {
            this.logger = logaloo.getLogger(Clingy);
            this.lookupResolver = new LookupResolver(caseSensitive);
            this.inputParser = new InputParser(legalQuotes);
            this.map = commands;
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
            this.logger.debug("Resolving pathUsed: {}", path);
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
            this.logger.debug("Parsing input: '{}'", input);
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
                        this.logger.warn("Alias '{}' conflicts with a previously defined key, will be ignored.", alias);
                    }
                    else {
                        this.logger.trace("Created alias '{}' for '{}'", alias, key);
                        this.mapAliased.set(alias, value);
                    }
                });
            });
            this.logger.debug("Done updating aliased map.");
        }
    }

    return Clingy;

}());
//# sourceMappingURL=clingy.js.map
