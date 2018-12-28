var clingy = (function (exports) {
    'use strict';

    // File is named "_index.ts" to avoid it being treated as a module index file.

    /**
     * Checks if the value is an instance of any of the given classes.
     * If at least one class gives back true, true is returned.
     *
     * @memberof Is
     * @since 1.0.0
     * @param {any} val Value to check.
     * @param {...Class} targets Classes to check.
     * @returns {boolean} If the value is an instance of the class.
     * @example
     * isInstanceOf([], Array)
     * // => true
     *
     * isInstanceOf([], Map, Set, Array)
     * // => true
     *
     * isInstanceOf({}, Array, Set)
     * // => false
     */
    const isInstanceOf = (val, ...targets) => targets.some(target => val instanceof target);

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
     * Iterates over each entry of an object.
     *
     * @memberof For
     * @param {object} obj Object to iterate.
     * @param {function} fn Function to use (`fn(key: *, val: *, index: number, obj: object) => void`).
     * @example
     * const a = {a: 1, b: 2};
     *
     * forEachEntry(a, (key, val, index) => {
     *     a[key] = val * index;
     * })
     * // a = {a: 0, b: 2}
     */
    const forEachEntry = (obj, fn) => {
        for (const [key, val] of Object.entries(obj)) {
            fn(val, key, obj);
        }
    };

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
     * Checks if a value is a map.
     *
     * @memberof Is
     * @since 1.0.0
     * @param {any} val Value to check.
     * @returns {boolean} If the value is a map.
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
     * Checks if a value is a plain object.
     *
     * An object is considered plain of its direct constructor is the built-in object constructor.
     *
     * @memberof Is
     * @since 2.9.0
     * @param {any} val Value to check.
     * @returns {boolean} If the value is a plain object.
     * @example
     * isObjectPlain({})
     * // => true
     *
     * isObjectPlain([])
     * // => false
     *
     * isObjectPlain(() => 1)
     * // => false
     *
     * isObjectPlain(1)
     * // => false
     */
    const isObjectPlain = (val) => isObject(val) && val.constructor === Object;

    // noinspection SpellCheckingInspection
    /**
     * Returns the levenshtein string distance of two strings.
     *
     * @memberof String
     * @since 6.3.0
     * @param {string} str1 First string to compare.
     * @param {string} str2 Second string to compare.
     * @returns {number} Distance between the two strings.
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
     * Returns an array with every falsey value removed.
     *
     * @memberof Array
     * @since 1.0.0
     * @param {any[]} arr Array to compact.
     * @returns {any[]} Compacted array.
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
     * @memberof Array
     * @since 6.1.0
     * @param {any[]} arr Array to collect.
     * @param {function} fn Function to use for collection (`fn(val: *, index: number, arr: any[]) => any`).
     * @returns {Map<any, any[]>} Map<val: *, arr: any[]> Collected map.
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
     * Returns strings similar to the input based its distance to the values in the list given.
     *
     * @memberof String
     * @since 6.3.0
     * @param {string} str String to check.
     * @param {Array<string>} list Array of values to compare the string to.
     * @param {boolean} [returnFull=false] If the full map should be returned, rather than just the closest matches.
     * @returns {Array<string>|Map<number,string[]>} Array of the closest matches, or the map if `returnFull` is true.
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
        if (!returnFull) {
            return result.get(Math.min(...result.keys()));
        }
        return result;
    };

    /**
     * Map containing {@link ICommand}s.
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
            if (isMap(commands)) {
                commands.forEach(val => CommandMap.createWithOptionsHelper(val, options));
            }
            else if (isObjectPlain(commands)) {
                forEachEntry(commands, val => CommandMap.createWithOptionsHelper(val, options));
            }
            return new CommandMap(commands);
        }
        static createWithOptionsHelper(command, options) {
            if (isObjectPlain(command.sub) || isMap(command.sub)) {
                command.sub = new Clingy(CommandMap.createWithOptions(command.sub, options), options);
            }
        }
        static getConstructorMap(input) {
            if (isMap(input)) {
                return Array.from(input.entries());
            }
            if (isObject(input)) {
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
            if (caseSensitivity === 1 /* INSENSITIVE */) {
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
            if (caseSensitivity === 1 /* INSENSITIVE */) {
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

    /**
     * Default level-list.
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
     * Name of the default appenderFn, can be used to detach it.
     */
    const DEFAULT_APPENDER_NAME = "defaultAppender";
    /**
     * Default appender-fn, doing the actual logging.
     *
     * @private
     * @param level Level of the entry to log.
     * @param name Name of the logger instance.
     * @param args Arguments to log.
     */
    const defaultAppenderFn = (level, name, args) => {
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
        loggerFn(`${new Date().toISOString()} ${level.name} ${name}`, ...args);
    };

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
    const isTypeOf$1 = (val, ...types) => types.some(type => typeof val === type);

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
    const isNil$1 = (val) => val == null;

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
    const isObjectLike$1 = (val) => !isNil$1(val) && isTypeOf$1(val, "object");

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
    const isString$1 = (val) => isTypeOf$1(val, "string");

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
    const isFunction$1 = (val) => isTypeOf$1(val, "function");

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
    const isObject$1 = (val) => isObjectLike$1(val) || isFunction$1(val);

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
         * @param level Levels of the log.
         * @param args Arguments to be logged.
         */
        log(level, ...args) {
            if (this.root.getLevel().val >= level.val) {
                this.root.getAppenders().forEach(fn => fn(level, this.name, args));
            }
        }
        /**
         * Logs an error.
         *
         * @param args Arguments to be logged.
         */
        error(...args) {
            this.log(Levels.ERROR, ...args);
        }
        /**
         * Logs a warning.
         *
         * @param args Arguments to be logged.
         */
        warn(...args) {
            this.log(Levels.WARN, ...args);
        }
        /**
         * Logs an info.
         *
         * @param args Arguments to be logged.
         */
        info(...args) {
            this.log(Levels.INFO, ...args);
        }
        /**
         * Logs a debug message.
         *
         * @param args Arguments to be logged.
         */
        debug(...args) {
            this.log(Levels.DEBUG, ...args);
        }
        /**
         * Logs a trace message.
         *
         * @param args Arguments to be logged.
         */
        trace(...args) {
            this.log(Levels.TRACE, ...args);
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
            this.appenders = new Map([
                [DEFAULT_APPENDER_NAME, defaultAppenderFn]
            ]);
            this.level = Levels.INFO;
        }
        /**
         * Gets and/or creates a logger instance.
         *
         * @param nameable String or INameable (ex: named class or named function).
         * @returns The logger instance.
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
            if (this.loggers.has(name)) {
                return this.loggers.get(name);
            }
            const logger = new DefaultLogger(this, name);
            this.loggers.set(name, logger);
            return logger;
        }
        /**
         * Gets the active log level.
         *
         * @return The active log level.
         */
        getLevel() {
            return this.level;
        }
        /**
         * Sets the active log level.
         *
         * @param level Level to set.
         */
        setLevel(level) {
            this.level = level;
        }
        /**
         * Attaches an appender to the instance.
         *
         * @param name Name of the appender.
         * @param fn Appender function.
         */
        attachAppender(name, fn) {
            this.appenders.set(name, fn);
        }
        /**
         * Detaches an appender.
         *
         * @param name Name of the appender.
         */
        detachAppender(name) {
            this.appenders.delete(name);
        }
        /**
         * Gets all active appenders.
         *
         * @return All active appenders.
         */
        getAppenders() {
            return this.appenders;
        }
    }

    const clingyLogby = new Logby();

    /**
     * Orchestrates mapping of {@link IArgument}s to user-provided input.
     *
     * @private
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
                else if (!isNil(expectedArg.defaultValue)) {
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

    /**
     * Gets similar keys of a key based on their string distance.
     *
     * @private
     * @param mapAliased Map to use for lookup.
     * @param name       Key to use.
     * @return List of similar keys.
     */
    const getSimilar = (mapAliased, name) => strSimilar(name, Array.from(mapAliased.keys()), false);

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
                ? 0 /* SENSITIVE */
                : 1 /* INSENSITIVE */;
        }
        static createSuccessResult(pathNew, pathUsed, command, args) {
            const lookupSuccess = {
                successful: true,
                pathUsed,
                pathDangling: pathNew,
                type: 0 /* SUCCESS */,
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
                type: 1 /* ERROR_NOT_FOUND */,
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
                type: 2 /* ERROR_MISSING_ARGUMENT */,
                missing
            };
        }
        /**
         * Resolves a pathUsed through a {@link CommandMap}.
         *
         * @param commandMap        Map to use.
         * @param path              Path to getPath.
         * @param argumentResolving Strategy for resolving arguments.
         * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
         * or {@link ILookupErrorMissingArgs}.
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
                isInstanceOf(command.sub, Clingy) &&
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
            if (argumentResolving === 1 /* IGNORE */ ||
                isNil(command.args) ||
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
        // noinspection TsLint
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
        // noinspection JSUnusedGlobalSymbols
        // TODO replace .has() with .hasCommand() (breaking)
        /**
         * Checks if a command on this instance exists for this key.
         *
         * @param key Key of the command.
         */
        hasCommand(key) {
            return this.mapAliased.has(key);
        }
        // noinspection JSUnusedGlobalSymbols
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
            return this.lookupResolver.resolve(this.mapAliased, path, 1 /* IGNORE */);
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
            return this.lookupResolver.resolve(this.mapAliased, this.inputParser.parse(input), 0 /* RESOLVE */);
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

}({}));
//# sourceMappingURL=clingy.js.map
