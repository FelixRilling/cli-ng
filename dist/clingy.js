var clingy = (function (exports, lodash) {
    'use strict';

    var CaseSensitivity;
    (function (CaseSensitivity) {
        CaseSensitivity[CaseSensitivity["SENSITIVE"] = 0] = "SENSITIVE";
        CaseSensitivity[CaseSensitivity["INSENSITIVE"] = 1] = "INSENSITIVE";
    })(CaseSensitivity || (CaseSensitivity = {}));

    /**
     * Map containing {@link Command}s.
     *
     * @private
     */
    class CommandMap extends Map {
        constructor(input) {
            super(CommandMap.getConstructorMap(input));
        }
        /**
         * Creates a new instance with {@link Clingy} options to inherit.
         *
         * @param commands Command input to use.
         * @param options Options for the Clingy instance.
         */
        static createWithOptions(commands, options) {
            if (lodash.isMap(commands)) {
                commands.forEach(val => CommandMap.createWithOptionsHelper(val, options));
            }
            else if (lodash.isPlainObject(commands)) {
                lodash.forEach(commands, val => CommandMap.createWithOptionsHelper(val, options));
            }
            return new CommandMap(commands);
        }
        static createWithOptionsHelper(command, options) {
            if (lodash.isPlainObject(command.sub) || lodash.isMap(command.sub)) {
                command.sub = new Clingy(CommandMap.createWithOptions(command.sub, options), options);
            }
        }
        static getConstructorMap(input) {
            if (lodash.isMap(input)) {
                return Array.from(input.entries());
            }
            if (lodash.isObject(input)) {
                return Array.from(Object.entries(input));
            }
            return null;
        }
        /**
         * Checks if the map contains a key, ignoring case.
         *
         * @param key Key to check for.
         * @param caseSensitivity Case sensitivity to use.
         * @return If the map contains a key, ignoring case.
         */
        hasCommand(key, caseSensitivity) {
            if (caseSensitivity === CaseSensitivity.INSENSITIVE) {
                return Array.from(this.keys())
                    .map(k => k.toLowerCase())
                    .includes(key.toLowerCase());
            }
            return this.has(key);
        }
        /**
         * Returns the value for the key, ignoring case.
         *
         * @param key Key to check for.
         * @param caseSensitivity Case sensitivity to use.
         * @return The value for the key, ignoring case.
         */
        getCommand(key, caseSensitivity) {
            if (caseSensitivity === CaseSensitivity.INSENSITIVE) {
                let result = null;
                this.forEach((value, k) => {
                    if (key.toLowerCase() === k.toLowerCase()) {
                        result = value;
                    }
                });
                return result;
            }
            // Return null instead of undefined to be backwards compatible.
            return this.has(key) ? this.get(key) : null;
        }
    }

    // File is named "_index.ts" to avoid it being treated as a module index file.

    /**
     * Checks if the value has any of the given types.
     * If at least one type gives back true, true is returned.
     *
     * @memberof Is
     * @since 1.0.0
     * @param {any} val Value to check.
     * @param {...string} types Type strings to compare the value to.
     * @returns {boolean} If the value has the type provided.
     * @example
     * isTypeOf("foo", "string")
     * // => true
     *
     * isTypeOf("foo", "number", "string")
     * // => true
     *
     * isTypeOf("foo", "number")
     * // => false
     */
    const isTypeOf = (val, ...types) => types.some(type => typeof val === type);

    /**
     * Checks if a value is undefined or null.
     *
     * @memberof Is
     * @since 1.0.0
     * @param {any} val Value to check.
     * @returns {boolean} If the value is nil.
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
     * Checks if a value is not nil and has a type of object.
     *
     * The main difference to {@link isObject} is that functions are not considered object-like,
     * because `typeof function(){}` returns `"function"`.
     *
     * @memberof Is
     * @since 1.0.0
     * @param {any} val Value to check,
     * @returns {boolean} If the value is object-like.
     * @example
     * isObjectLike({})
     * // => true
     *
     * isObjectLike([])
     * // => true
     *
     * isObjectLike(() => 1))
     * // => false
     *
     * isObjectLike(1)
     * // => false
     */
    const isObjectLike = (val) => !isNil(val) && isTypeOf(val, "object");

    /**
     * Checks if a value is a string.
     *
     * @memberof Is
     * @since 1.0.0
     * @param {any} val Value to check.
     * @returns {boolean} if the value is a string.
     * @example
     * isString("foo")
     * // => true
     *
     * isString(1)
     * // => false
     */
    const isString = (val) => isTypeOf(val, "string");

    /**
     * Checks if a value is a function.
     *
     * @memberof Is
     * @since 1.0.0
     * @param {any} val Value to check.
     * @returns {boolean} If the value is a function.
     * @example
     * isFunction(function a(){})
     * // => true
     *
     * isFunction(Array.from)
     * // => true
     *
     * isFunction(null)
     * // => false
     */
    const isFunction = (val) => isTypeOf(val, "function");

    /**
     * Checks if a value is an object.
     *
     * @memberof Is
     * @since 1.0.0
     * @param {any} val Value to check.
     * @returns {boolean} If the value is an object.
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
    const isObject = (val) => isObjectLike(val) || isFunction(val);

    /**
     * Checks if a value is a symbol.
     *
     * @memberof Is
     * @since 1.0.0
     * @param {any} val Value to check.
     * @returns {boolean} If the value is a symbol.
     * @example
     * isSymbol(Symbol())
     * // => true
     *
     * isSymbol(Symbol.split)
     * // => true
     *
     * isSymbol("foo")
     * // => false
     */
    const isSymbol = (val) => isTypeOf(val, "symbol");

    /**
     * Gets name of a value.
     *
     * If the value has a name or description property, the value of that is returned.
     * If the value is a string, it is returned as is.
     * Otherwise null is returned.
     *
     * @memberof Get
     * @since 10.2.0
     * @param {any} val Value to check.
     * @returns {string} The name of the value.
     * @example
     * getName(class Foo{})
     * // => "Foo"
     *
     * getName(function bar(){})
     * // => "bar"
     *
     * getName(Symbol("abc"))
     * // => "abc"
     *
     * getName("foo")
     * // => "foo"
     *
     * getName(1)
     * // => null
     */
    const getName = (val) => {
        if (isString(val)) {
            return val;
        }
        if (isObject(val) && !isNil(val.name)) {
            return val.name;
        }
        if (isSymbol(val) && !isNil(val.description)) {
            return val.description;
        }
        return null;
    };

    /**
     * Default level-list. Can be used to set the level of a {@link Logby} instance.
     *
     * @public
     */
    const Levels = {
        NONE: {
            val: -1
        },
        ERROR: {
            name: "ERROR",
            val: 0
        },
        WARN: {
            name: "WARN",
            val: 1
        },
        INFO: {
            name: "INFO",
            val: 2
        },
        DEBUG: {
            name: "DEBUG",
            val: 3
        },
        TRACE: {
            name: "TRACE",
            val: 4
        }
    };

    /**
     * Helper method for creating log entry prefix.
     *
     * @private
     * @param name Name of the logger instance.
     * @param level Level of the entry to log.
     * @returns Log entry prefix.
     */
    const createDefaultLogPrefix = (name, level) => `${new Date().toISOString()} ${level.name} ${name}`;
    /**
     * Default appender, doing the actual logging.
     *
     * @public
     * @param name Name of the logger instance.
     * @param level Level of the entry to log.
     * @param args Arguments to log.
     */
    const defaultLoggingAppender = (name, level, args) => {
        let loggerFn = console.log;
        if (level === Levels.ERROR) {
            // tslint:disable-next-line
            loggerFn = console.error;
        }
        else if (level === Levels.WARN) {
            // tslint:disable-next-line
            loggerFn = console.warn;
        }
        else if (level === Levels.INFO) {
            // tslint:disable-next-line
            loggerFn = console.info;
        }
        loggerFn(createDefaultLogPrefix(name, level), ...args);
    };

    /**
     * Checks if the given level is considered part of the active level.
     *
     * @private
     * @param incoming Level to check.
     * @param active level to check against.
     * @returns if the given level matches the active level.
     */
    const matchesLevel = (incoming, active) => incoming.val <= active.val;

    /**
     * Default {@link ILogger} class.
     *
     * @private
     */
    class DefaultLogger {
        /**
         * Creates a new {@link DefaultLogger}.
         * Should not be constructed directly, rather use {@link Logby.getLogger}.
         *
         * @public
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
         * @public
         * @param level Levels of the log.
         * @param args Arguments to be logged.
         */
        log(level, ...args) {
            if (this.root.level.val >= level.val) {
                this.root.appenders.forEach(fn => fn(this.name, level, args));
            }
        }
        /**
         * Logs an error.
         *
         * @public
         * @param args Arguments to be logged.
         */
        error(...args) {
            this.log(Levels.ERROR, ...args);
        }
        /**
         * Logs a warning.
         *
         * @public
         * @param args Arguments to be logged.
         */
        warn(...args) {
            this.log(Levels.WARN, ...args);
        }
        /**
         * Logs an info.
         *
         * @public
         * @param args Arguments to be logged.
         */
        info(...args) {
            this.log(Levels.INFO, ...args);
        }
        /**
         * Logs a debug message.
         *
         * @public
         * @param args Arguments to be logged.
         */
        debug(...args) {
            this.log(Levels.DEBUG, ...args);
        }
        /**
         * Logs a trace message.
         *
         * @public
         * @param args Arguments to be logged.
         */
        trace(...args) {
            this.log(Levels.TRACE, ...args);
        }
        /**
         * Checks if the currently set log level includes error logging.
         *
         * @public
         * @returns if the currently set log level includes error logging.
         */
        isError() {
            return matchesLevel(Levels.ERROR, this.root.level);
        }
        /**
         * Checks if the currently set log level includes warning logging.
         *
         * @public
         * @returns if the currently set log level includes warning logging.
         */
        isWarn() {
            return matchesLevel(Levels.WARN, this.root.level);
        }
        /**
         * Checks if the currently set log level includes info logging.
         *
         * @public
         * @returns if the currently set log level includes info logging.
         */
        isInfo() {
            return matchesLevel(Levels.INFO, this.root.level);
        }
        /**
         * Checks if the currently set log level includes debug logging.
         *
         * @public
         * @returns if the currently set log level includes debug logging.
         */
        isDebug() {
            return matchesLevel(Levels.DEBUG, this.root.level);
        }
        /**
         * Checks if the currently set log level includes trace logging.
         *
         * @public
         * @returns if the currently set log level includes trace logging.
         */
        isTrace() {
            return matchesLevel(Levels.TRACE, this.root.level);
        }
    }

    /**
     * Main logby class.
     */
    class Logby {
        /**
         * Creates a new Logby instance.
         */
        constructor() {
            this.loggers = new Map();
            this.appenders = new Set([defaultLoggingAppender]);
            this.level = Levels.INFO;
        }
        /**
         * Gets and/or creates a logger instance.
         *
         * @param nameable String or INameable (ex: named class or named function).
         * @returns The logger instance.
         */
        getLogger(nameable) {
            const name = getName(nameable);
            if (name == null) {
                throw new TypeError(`'${nameable}' is neither an INameable nor a string.`);
            }
            if (!this.loggers.has(name)) {
                const logger = new DefaultLogger(this, name);
                this.loggers.set(name, logger);
            }
            return this.loggers.get(name);
        }
    }

    const clingyLogby = new Logby();

    var ArgumentResolving;
    (function (ArgumentResolving) {
        ArgumentResolving[ArgumentResolving["RESOLVE"] = 0] = "RESOLVE";
        ArgumentResolving[ArgumentResolving["IGNORE"] = 1] = "IGNORE";
    })(ArgumentResolving || (ArgumentResolving = {}));

    /**
     * Orchestrates mapping of {@link Argument}s to user-provided input.
     *
     * @private
     */
    class ArgumentMatcher {
        /**
         * Matches a list of {@link Argument}s to a list of string input arguments.
         *
         * @param expected {@link Argument} list of a {@link ICommand}
         * @param provided List of user-provided arguments.
         */
        constructor(expected, provided) {
            this.missing = [];
            this.result = new Map();
            ArgumentMatcher.logger.debug("Matching arguments:", expected, provided);
            expected.forEach((expectedArg, i) => {
                if (i < provided.length) {
                    const providedArg = provided[i];
                    ArgumentMatcher.logger.trace(`Found matching argument for ${expectedArg.name}, adding to result: ${providedArg}`);
                    this.result.set(expectedArg.name, providedArg);
                }
                else if (expectedArg.required) {
                    ArgumentMatcher.logger.trace(`No matching argument found for ${expectedArg.name}, adding to missing.`);
                    this.missing.push(expectedArg);
                }
                else if (!lodash.isNil(expectedArg.defaultValue)) {
                    ArgumentMatcher.logger.trace(`No matching argument found for ${expectedArg.name}, using default: ${expectedArg.defaultValue}`);
                    this.result.set(expectedArg.name, expectedArg.defaultValue);
                }
                else {
                    ArgumentMatcher.logger.trace(`No matching argument found for ${expectedArg.name}, using null.`);
                    this.result.set(expectedArg.name, null);
                }
            });
            ArgumentMatcher.logger.debug(`Finished matching arguments: ${expected.length} expected, ${this.result.size} found and ${this.missing.length} missing.`);
        }
    }
    ArgumentMatcher.logger = clingyLogby.getLogger(ArgumentMatcher);

    // noinspection SpellCheckingInspection
    /**
     * Returns the levenshtein string distance of two strings.
     *
     * @since 6.3.0
     * @memberOf String
     * @param str1 First string to compare.
     * @param str2 Second string to compare.
     * @returns Distance between the two strings.
     * @example
     * distance("Kitten", "Sitting")
     * // => 3
     *
     * distance("String", "Stribng")
     * // => 1
     *
     * distance("foo", "foo")
     * // => 0
     */
    const distance = (str1, str2) => {
        if (str1.length === 0) {
            return str2.length;
        }
        if (str2.length === 0) {
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
     * Collects elements in an array into a an array of merged elements.
     *
     * @since 11.0.0
     * @memberOf Array
     * @param collection Collection to group.
     * @param keyProducer Function returning the key for the value.
     * @param initializer Function initializing a new mergable object.
     * @param reducer Consumer mutating the existing object with the new data.
     * @returns Grouped and merged map.
     * @example
     * groupMapReducingBy(
     *     ["foo", "bar", "fizz", "buzz"],
     *     val => val.charAt(0),
     *     () => {
     *        return {
     *            count: 0,
     *            matches: []
     *        };
     *     },
     *     (current, val) => {
     *         current.count++;
     *         current.matches.push(val);
     *         return current;
     *     }
     * )
     * // => Map{"f": {count: 2, matches: ["foo", "fizz"]}, "b": {count: 2, matches: ["bar", "buzz"]}}
     */
    const groupMapReducingBy = (collection, keyProducer, initializer, reducer) => {
        const result = new Map();
        lodash.forEach(collection, (value, index) => {
            const key = keyProducer(value, index, collection);
            if (!result.has(key)) {
                result.set(key, initializer(value, index, collection));
            }
            result.set(key, reducer(result.get(key), value, index, collection));
        });
        return result;
    };

    /**
     * Collects the values of an array in a map as array values,
     * using the return value of the function as key.
     *
     * @since 6.1.0
     * @memberOf Array
     * @param collection Collection to group.
     * @param keyFn Function to use for grouping.
     * @returns Grouped map.
     * @example
     * groupMapBy([1, 2, 3, 4, 5], val => val % 2)
     * // => Map{0: [2, 4], 1: [1, 3, 5]}
     */
    const groupMapBy = (collection, keyFn) => groupMapReducingBy(collection, keyFn, () => [], (current, value) => lodash.concat(current, value));

    // noinspection SpellCheckingInspection
    /**
     * Returns strings similar to the input based its levenshtein distance to the values in the list given.
     *
     * @since 6.3.0
     * @memberOf String
     * @param str String to check.
     * @param collection Array of values to compare the string to.
     * @param returnFull If the full map should be returned, rather than just the closest matches.
     * @returns Array of the closest matches, or the map if `returnFull` is true.
     * @example
     * similar("Fob", ["Foo", "Bar"])
     * // => ["Foo"]
     *
     * similar("cmmit", ["init", "commit", "push"])
     * // => ["commit"]
     *
     * similar("Kitten", ["Sitten", "Sitting", "Bitten"])
     * // => ["Sitten", "Bitten"]
     *
     * similar("cmmit", ["init", "commit", "push"], true)
     * // => Map<number, string[]>{1: ["commit"], 3: ["init"], 5: ["push"]}
     */
    const similar = (str, collection, returnFull = false) => {
        const result = groupMapBy(collection, (value) => distance(str, value));
        if (returnFull) {
            return result;
        }
        const lowestKey = Math.min(...result.keys());
        return result.get(lowestKey);
    };

    /**
     * Gets similar keys of a key based on their string distance.
     *
     * @private
     * @param mapAliased Map to use for lookup.
     * @param name       Key to use.
     * @return List of similar keys.
     */
    const getSimilar = (mapAliased, name) => similar(name, Array.from(mapAliased.keys()), false);

    var ResultType;
    (function (ResultType) {
        ResultType[ResultType["SUCCESS"] = 0] = "SUCCESS";
        ResultType[ResultType["ERROR_NOT_FOUND"] = 1] = "ERROR_NOT_FOUND";
        ResultType[ResultType["ERROR_MISSING_ARGUMENT"] = 2] = "ERROR_MISSING_ARGUMENT";
    })(ResultType || (ResultType = {}));

    /**
     * Lookup tools for resolving paths through {@link CommandMap}s.
     *
     * @private
     */
    class LookupResolver {
        /**
         * Creates a new {@link LookupResolver}.
         *
         * @param caseSensitive If the lookup should honor case.
         */
        constructor(caseSensitive = true) {
            this.caseSensitivity = caseSensitive
                ? CaseSensitivity.SENSITIVE
                : CaseSensitivity.INSENSITIVE;
        }
        static createSuccessResult(pathNew, pathUsed, command, args) {
            const lookupSuccess = {
                successful: true,
                pathUsed,
                pathDangling: pathNew,
                type: ResultType.SUCCESS,
                command,
                args
            };
            LookupResolver.logger.debug("Returning successful lookup result:", lookupSuccess);
            return lookupSuccess;
        }
        static createNotFoundResult(pathNew, pathUsed, currentPathFragment, commandMap) {
            LookupResolver.logger.warn(`Command '${currentPathFragment}' could not be found.`);
            return {
                successful: false,
                pathUsed,
                pathDangling: pathNew,
                type: ResultType.ERROR_NOT_FOUND,
                missing: currentPathFragment,
                similar: getSimilar(commandMap, currentPathFragment)
            };
        }
        static createMissingArgsResult(pathNew, pathUsed, missing) {
            LookupResolver.logger.warn("Some arguments could not be found:", missing);
            return {
                successful: false,
                pathUsed,
                pathDangling: pathNew,
                type: ResultType.ERROR_MISSING_ARGUMENT,
                missing
            };
        }
        /**
         * Resolves a pathUsed through a {@link CommandMap}.
         *
         * @param commandMap        Map to use.
         * @param path              Path to getPath.
         * @param argumentResolving Strategy for resolving arguments.
         * @return Lookup result, either {@link LookupSuccess}, {@link LookupErrorNotFound}
         * or {@link LookupErrorMissingArgs}.
         */
        resolve(commandMap, path, argumentResolving) {
            if (path.length === 0) {
                throw new Error("Path cannot be empty.");
            }
            return this.resolveInternal(commandMap, path, [], argumentResolving);
        }
        resolveInternal(commandMap, path, pathUsed, argumentResolving) {
            const currentPathFragment = path[0];
            const pathNew = path.slice(1);
            pathUsed.push(currentPathFragment);
            if (!this.hasCommand(commandMap, currentPathFragment)) {
                return LookupResolver.createNotFoundResult(pathNew, pathUsed, currentPathFragment, commandMap);
            }
            // We already checked if the key exists, assert its existence.
            const command = (commandMap.getCommand(currentPathFragment, this.caseSensitivity));
            LookupResolver.logger.debug(`Found command: '${currentPathFragment}'.`);
            /*
             * Recurse into sub-commands if:
             * Additional items are in the path AND
             * the current command has sub-commands AND
             * the sub-commands contain the next path item.
             */
            if (pathNew.length > 0 &&
                command.sub instanceof Clingy &&
                this.hasCommand(command.sub.mapAliased, pathNew[0])) {
                return this.resolveInternalSub(pathNew, pathUsed, command, argumentResolving);
            }
            /*
             * Skip checking for arguments if:
             * The parameter argumentResolving is set to ignore arguments OR
             * the command has no arguments defined OR
             * the command has an empty array defined as arguments.
             */
            let argumentsResolved;
            if (argumentResolving === ArgumentResolving.IGNORE ||
                lodash.isNil(command.args) ||
                command.args.length === 0) {
                LookupResolver.logger.debug("No arguments defined, using empty map.");
                argumentsResolved = new Map();
            }
            else {
                LookupResolver.logger.debug(`Looking up arguments: '${pathNew}'.`);
                const argumentMatcher = new ArgumentMatcher(command.args, pathNew);
                if (argumentMatcher.missing.length > 0) {
                    return LookupResolver.createMissingArgsResult(pathNew, pathUsed, argumentMatcher.missing);
                }
                argumentsResolved = argumentMatcher.result;
                LookupResolver.logger.debug("Successfully looked up arguments: ", argumentsResolved);
            }
            return LookupResolver.createSuccessResult(pathNew, pathUsed, command, argumentsResolved);
        }
        resolveInternalSub(pathNew, pathUsed, command, argumentResolving) {
            LookupResolver.logger.debug("Resolving sub-commands:", command.sub, pathNew);
            return this.resolveInternal(command.sub.mapAliased, pathNew, pathUsed, argumentResolving);
        }
        hasCommand(commandMap, pathPart) {
            return commandMap.hasCommand(pathPart, this.caseSensitivity);
        }
    }
    LookupResolver.logger = clingyLogby.getLogger(LookupResolver);

    /**
     * Manages parsing input strings into a path list.
     *
     * @private
     */
    class InputParser {
        /**
         * Creates an {@link InputParser}.
         *
         * @param legalQuotes List of quotes to use when parsing strings.
         */
        constructor(legalQuotes = ["\""]) {
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
            // Noinspection AssignmentResultUsedJS
            while ((match = pattern.exec(input))) {
                InputParser.logger.trace(`Found match '${match}'`);
                const groups = lodash.compact(match.slice(1));
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
    InputParser.logger = clingyLogby.getLogger(InputParser);

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

    exports.Clingy = Clingy;
    exports.clingyLogby = clingyLogby;

    return exports;

}({}, _));
//# sourceMappingURL=clingy.js.map
