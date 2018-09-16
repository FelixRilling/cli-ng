var clingy = (function (exports) {
    'use strict';

    /**
     * Checks if a value is an array.
     *
     * Alias of the native `Array.isArray`.
     *
     * @function isArray
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @returns {boolean}
     * @example
     * isArray([1, 2, 3]);
     * // => true
     *
     * isArray({});
     * // => false
     */

    /**
     * Checks if the value is an instance of a target constructor.
     *
     * @function isInstanceOf
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @param {Class} target
     * @returns {boolean}
     * @example
     * isInstanceOf([], Array)
     * // => true
     *
     * isInstanceOf({}, Array)
     * // => false
     */
    const isInstanceOf = (val, target) => val instanceof target;

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
     * isNil(0)
     * // => false
     *
     * isNil("")
     * // => false
     */
    const isNil = (val) => val == null;

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
     * isTypeOf("foo", "string")
     * // => true
     *
     * isTypeOf("foo", "number")
     * // => false
     */
    const isTypeOf = (val, type) => typeof val === type;

    /**
     * Checks if a value is a map.
     *
     * @function isMap
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @returns {boolean}
     * @example
     * isMap(new Map())
     * // => true
     *
     * isMap([[1, 2]])
     * // => false
     */
    const isMap = (val) => isInstanceOf(val, Map);

    /**
     * Checks if a value is an object.
     *
     * @function isObject
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @returns {boolean}
     * @example
     * isObject({})
     * // => true
     *
     * isObject([])
     * // => true
     *
     * isObject(() => 1))
     * // => true
     *
     * isObject(1)
     * // => false
     */
    const isObject = (val) => !isNil(val) && (isTypeOf(val, "object") || isTypeOf(val, "function"));

    // noinspection SpellCheckingInspection
    /**
     * Returns Levenshtein string distance of two strings.
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
        if (str1.length === 0) {
            return str2.length;
        }
        else if (str2.length === 0) {
            return str1.length;
        }
        const matrix = [];
        for (let y = 0; y <= str2.length; y++) {
            matrix[y] = [y];
        }
        for (let x = 0; x <= str1.length; x++) {
            matrix[0][x] = x;
        }
        for (let y = 1; y <= str2.length; y++) {
            const matrixColumnCurrent = matrix[y];
            const matrixColumnLast = matrix[y - 1];
            for (let x = 1; x <= str1.length; x++) {
                if (str2.charAt(y - 1) === str1.charAt(x - 1)) {
                    matrixColumnCurrent[x] = matrixColumnLast[x - 1];
                }
                else {
                    const substitution = matrixColumnLast[x - 1] + 1;
                    const insertion = matrixColumnCurrent[x - 1] + 1;
                    const deletion = matrixColumnLast[x] + 1;
                    matrixColumnCurrent[x] = Math.min(substitution, insertion, deletion);
                }
            }
        }
        return matrix[str2.length][str1.length];
    };

    /**
     * Returns an array with every falsey value removed out.
     *
     * @function arrCompact
     * @memberof Array
     * @since 1.0.0
     * @param {any[]} arr
     * @returns {any[]}
     * @example
     * arrCompact([1, "", "", 2, 3, null, 4, undefined, 5, ""])
     * // => [1, 2, 3, 4, 5]
     */
    const arrCompact = (arr) => arr.filter(val => val);

    /**
     * Collects the values of an array in a map as arrays.
     * If the function returns a nil value, the element will be skipped,
     * otherwise the return value will be used as key.
     *
     * @function arrCollect
     * @memberof Array
     * @since 6.1.0
     * @param {any[]} arr
     * @param {function} fn fn(val: *, index: number, arr: any[])
     * @returns {Map<any, any[]>} Map<val: *, arr: any[]>
     * @example
     * arrCollect([1, 2, 3, 4, 5], val => val % 2)
     * // => Map<any, any[]>{0: [2, 4], 1: [1, 3, 5]}
     */
    const arrCollect = (arr, fn) => {
        const result = new Map();
        arr.forEach((val, index) => {
            const key = fn(val, index, arr);
            if (!isNil(key)) {
                result.set(key, result.has(key) ? [...result.get(key), val] : [val]);
            }
        });
        return result;
    };

    // noinspection SpellCheckingInspection
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
     * // => Map<number, string[]>{1: ["commit"], 3: ["init"], 5: ["push"]}
     */
    const strSimilar = (str, list, returnFull = false) => {
        const result = arrCollect(list, (val) => strDistance(str, val));
        return returnFull
            ? result
            : result.get(Math.min(...result.keys()));
    };

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

    /**
     * Default level-list.
     */
    const Level = {
        NONE: {
            val: -1
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
     * Checks if a value is an array.
     *
     * Alias of the native `Array.isArray`.
     *
     * @function isArray
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @returns {boolean}
     * @example
     * isArray([1, 2, 3]);
     * // => true
     *
     * isArray({});
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
     * isNil(0)
     * // => false
     *
     * isNil("")
     * // => false
     */
    const isNil$1 = (val) => val == null;

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
     * isTypeOf("foo", "string")
     * // => true
     *
     * isTypeOf("foo", "number")
     * // => false
     */
    const isTypeOf$1 = (val, type) => typeof val === type;

    /**
     * Checks if a value is a string.
     *
     * @function isString
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @returns {boolean}
     * @example
     * isString("foo")
     * // => true
     *
     * isString(1)
     * // => false
     */
    const isString$1 = (val) => isTypeOf$1(val, "string");

    /**
     * Checks if a value is an object.
     *
     * @function isObject
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @returns {boolean}
     * @example
     * isObject({})
     * // => true
     *
     * isObject([])
     * // => true
     *
     * isObject(() => 1))
     * // => true
     *
     * isObject(1)
     * // => false
     */
    const isObject$1 = (val) => !isNil$1(val) && (isTypeOf$1(val, "object") || isTypeOf$1(val, "function"));

    /**
     * Logger class.
     */
    class Logger {
        /**
         * Creates a new {@link Logger}.
         * Should not be constructed directly, rather use {@link Logby.getLogger}
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
                this.root.appenderQueue.forEach(fn => fn(level, this.name, args));
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

    const defaultAppenderFn = (level, name, args) => console.log(`${new Date().toISOString()} ${level.name} ${name}`, ...args);

    /**
     * Logger-root class.
     */
    class Logby {
        /**
         * Creates a new logger module.
         *
         * @param level Level of this logger-root loggers.
         */
        constructor(level = Level.INFO) {
            this.loggerMap = new Map();
            this.level = level;
            this.appenderQueue = [defaultAppenderFn];
        }
        /**
         * Get a logger instance.
         *
         * @param nameable A string or an INameable (ex: class, function).
         * @returns The Logger instance.
         */
        getLogger(nameable) {
            let name;
            if (isObject$1(nameable) && "name" in nameable) {
                name = nameable.name;
            }
            else if (isString$1(nameable)) {
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

    const clingyLoggerRoot = new Logby();

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
            ArgumentMatcher.logger.debug(`Matching arguments ${expected} with ${provided}`);
            expected.forEach((expectedArg, i) => {
                if (i < provided.length) {
                    const providedArg = provided[i];
                    ArgumentMatcher.logger.trace(`Found matching argument for ${expectedArg.name}, adding to result: ${providedArg}`);
                    this.result.set(expectedArg.name, providedArg);
                }
                else if (!expectedArg.required &&
                    !isNil(expectedArg.defaultValue)) {
                    ArgumentMatcher.logger.trace(`No matching argument found for ${expectedArg.name}, using default: ${expectedArg.defaultValue}`);
                    this.result.set(expectedArg.name, expectedArg.defaultValue);
                }
                else {
                    ArgumentMatcher.logger.trace(`No matching argument found for ${expectedArg.name}, adding to missing.`);
                    this.missing.push(expectedArg);
                }
            });
            ArgumentMatcher.logger.debug(`Finished matching arguments: ${expected.length} expected, ${this.result.size} found and ${this.missing.length} missing.`);
        }
    }
    ArgumentMatcher.logger = clingyLoggerRoot.getLogger(ArgumentMatcher);

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
            if (path.length === 0) {
                throw new Error("Path cannot be empty.");
            }
            return this.resolveInternal(mapAliased, path, [], parseArguments);
        }
        resolveInternal(mapAliased, path, pathUsed, parseArguments) {
            const currentPathFragment = path[0];
            const pathNew = path.slice(1);
            pathUsed.push(currentPathFragment);
            if (this.caseSensitive
                ? !mapAliased.has(currentPathFragment)
                : !mapAliased.hasIgnoreCase(currentPathFragment)) {
                LookupResolver.logger.warn(`Command '${currentPathFragment}' could not be found.`);
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
            LookupResolver.logger.debug(`Successfully looked up command: ${currentPathFragment}`);
            if (pathNew.length > 0 && !isNil(command.sub)) {
                LookupResolver.logger.debug(`Resolving sub-commands: ${command.sub} ${pathNew}`);
                return this.resolveInternal(command.sub.mapAliased, pathNew, pathUsed, parseArguments);
            }
            let argumentsResolved;
            if (!parseArguments ||
                isNil(command.args) ||
                command.args.length === 0) {
                LookupResolver.logger.debug("No arguments defined, using empty list.");
                argumentsResolved = new Map();
            }
            else {
                LookupResolver.logger.debug(`Looking up arguments: ${pathNew}`);
                const argumentMatcher = new ArgumentMatcher(command.args, pathNew);
                if (argumentMatcher.missing.length > 0) {
                    LookupResolver.logger.warn(`Some arguments could not be found: ${argumentMatcher.missing.map(arg => arg.name)}`);
                    return {
                        successful: false,
                        pathUsed,
                        pathDangling: pathNew,
                        type: 2 /* ERROR_MISSING_ARGUMENT */,
                        missing: argumentMatcher.missing
                    };
                }
                argumentsResolved = argumentMatcher.result;
                LookupResolver.logger.debug(`Successfully looked up arguments: ${argumentsResolved}`);
            }
            const lookupSuccess = {
                successful: true,
                pathUsed,
                pathDangling: pathNew,
                type: 0 /* SUCCESS */,
                command,
                args: argumentsResolved
            };
            LookupResolver.logger.debug(`Returning successful lookup result: ${lookupSuccess}`);
            return lookupSuccess;
        }
    }
    LookupResolver.logger = clingyLoggerRoot.getLogger(LookupResolver);

    /**
     * Manages parsing input strings into a path list.
     */
    class InputParser {
        // noinspection TsLint
        /**
         * Creates an {@link InputParser}.
         *
         * @param legalQuotes List of quotes to use when parsing strings.
         */
        constructor(legalQuotes = ['"']) {
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
            InputParser.logger.debug(`Parsing input '${input}'`);
            const result = [];
            const pattern = new RegExp(this.pattern);
            let match;
            // noinspection AssignmentResultUsedJS
            while ((match = pattern.exec(input))) {
                InputParser.logger.trace(`Found match '${match}'`);
                const groups = arrCompact(match.slice(1));
                if (groups.length > 0) {
                    InputParser.logger.trace(`Found group '${groups[0]}'`);
                    result.push(groups[0]);
                }
            }
            return result;
        }
        generateMatcher() {
            InputParser.logger.debug("Creating matcher.");
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
                InputParser.logger.error("The parsing pattern is invalid, this should never happen.", e);
                throw e;
            }
            return result;
        }
    }
    InputParser.logger = clingyLoggerRoot.getLogger(InputParser);

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
        parse(input) {
            Clingy.logger.debug(`Parsing input: '${input}'`);
            return this.lookupResolver.resolve(this.mapAliased, this.inputParser.parse(input), true);
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
    Clingy.loggerRoot = clingyLoggerRoot;
    Clingy.logger = clingyLoggerRoot.getLogger(Clingy);

    exports.Clingy = Clingy;

    return exports;

}({}));
//# sourceMappingURL=clingy.js.map
