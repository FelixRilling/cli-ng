var Clingy = (function () {
    'use strict';

    /*
    * loglevel - https://github.com/pimterry/loglevel
    *
    * Copyright (c) 2013 Tim Perry
    * Licensed under the MIT license.
    */
    (function (root, definition) {
        if (typeof define === 'function' && define.amd) {
            define(definition);
        } else if (typeof module === 'object' && module.exports) {
            module.exports = definition();
        } else {
            root.log = definition();
        }
    }(undefined, function () {

        // Slightly dubious tricks to cut down minimized file size
        var noop = function() {};
        var undefinedType = "undefined";

        var logMethods = [
            "trace",
            "debug",
            "info",
            "warn",
            "error"
        ];

        // Cross-browser bind equivalent that works at least back to IE6
        function bindMethod(obj, methodName) {
            var method = obj[methodName];
            if (typeof method.bind === 'function') {
                return method.bind(obj);
            } else {
                try {
                    return Function.prototype.bind.call(method, obj);
                } catch (e) {
                    // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                    return function() {
                        return Function.prototype.apply.apply(method, [obj, arguments]);
                    };
                }
            }
        }

        // Build the best logging method possible for this env
        // Wherever possible we want to bind, not wrap, to preserve stack traces
        function realMethod(methodName) {
            if (methodName === 'debug') {
                methodName = 'log';
            }

            if (typeof console === undefinedType) {
                return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
            } else if (console[methodName] !== undefined) {
                return bindMethod(console, methodName);
            } else if (console.log !== undefined) {
                return bindMethod(console, 'log');
            } else {
                return noop;
            }
        }

        // These private functions always need `this` to be set properly

        function replaceLoggingMethods(level, loggerName) {
            /*jshint validthis:true */
            for (var i = 0; i < logMethods.length; i++) {
                var methodName = logMethods[i];
                this[methodName] = (i < level) ?
                    noop :
                    this.methodFactory(methodName, level, loggerName);
            }

            // Define log.log as an alias for log.debug
            this.log = this.debug;
        }

        // In old IE versions, the console isn't present until you first open it.
        // We build realMethod() replacements here that regenerate logging methods
        function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
            return function () {
                if (typeof console !== undefinedType) {
                    replaceLoggingMethods.call(this, level, loggerName);
                    this[methodName].apply(this, arguments);
                }
            };
        }

        // By default, we use closely bound real methods wherever possible, and
        // otherwise we wait for a console to appear, and then try again.
        function defaultMethodFactory(methodName, level, loggerName) {
            /*jshint validthis:true */
            return realMethod(methodName) ||
                   enableLoggingWhenConsoleArrives.apply(this, arguments);
        }

        function Logger(name, defaultLevel, factory) {
          var self = this;
          var currentLevel;
          var storageKey = "loglevel";
          if (name) {
            storageKey += ":" + name;
          }

          function persistLevelIfPossible(levelNum) {
              var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

              if (typeof window === undefinedType) return;

              // Use localStorage if available
              try {
                  window.localStorage[storageKey] = levelName;
                  return;
              } catch (ignore) {}

              // Use session cookie as fallback
              try {
                  window.document.cookie =
                    encodeURIComponent(storageKey) + "=" + levelName + ";";
              } catch (ignore) {}
          }

          function getPersistedLevel() {
              var storedLevel;

              if (typeof window === undefinedType) return;

              try {
                  storedLevel = window.localStorage[storageKey];
              } catch (ignore) {}

              // Fallback to cookies if local storage gives us nothing
              if (typeof storedLevel === undefinedType) {
                  try {
                      var cookie = window.document.cookie;
                      var location = cookie.indexOf(
                          encodeURIComponent(storageKey) + "=");
                      if (location !== -1) {
                          storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                      }
                  } catch (ignore) {}
              }

              // If the stored level is not valid, treat it as if nothing was stored.
              if (self.levels[storedLevel] === undefined) {
                  storedLevel = undefined;
              }

              return storedLevel;
          }

          /*
           *
           * Public logger API - see https://github.com/pimterry/loglevel for details
           *
           */

          self.name = name;

          self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
              "ERROR": 4, "SILENT": 5};

          self.methodFactory = factory || defaultMethodFactory;

          self.getLevel = function () {
              return currentLevel;
          };

          self.setLevel = function (level, persist) {
              if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
                  level = self.levels[level.toUpperCase()];
              }
              if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
                  currentLevel = level;
                  if (persist !== false) {  // defaults to true
                      persistLevelIfPossible(level);
                  }
                  replaceLoggingMethods.call(self, level, name);
                  if (typeof console === undefinedType && level < self.levels.SILENT) {
                      return "No console available for logging";
                  }
              } else {
                  throw "log.setLevel() called with invalid level: " + level;
              }
          };

          self.setDefaultLevel = function (level) {
              if (!getPersistedLevel()) {
                  self.setLevel(level, false);
              }
          };

          self.enableAll = function(persist) {
              self.setLevel(self.levels.TRACE, persist);
          };

          self.disableAll = function(persist) {
              self.setLevel(self.levels.SILENT, persist);
          };

          // Initialize with the right level
          var initialLevel = getPersistedLevel();
          if (initialLevel == null) {
              initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
          }
          self.setLevel(initialLevel, false);
        }

        /*
         *
         * Top-level API
         *
         */

        var defaultLogger = new Logger();

        var _loggersByName = {};
        defaultLogger.getLogger = function getLogger(name) {
            if (typeof name !== "string" || name === "") {
              throw new TypeError("You must supply a name when creating a logger.");
            }

            var logger = _loggersByName[name];
            if (!logger) {
              logger = _loggersByName[name] = new Logger(
                name, defaultLogger.getLevel(), defaultLogger.methodFactory);
            }
            return logger;
        };

        // Grab the current global log variable in case of overwrite
        var _log = (typeof window !== undefinedType) ? window.log : undefined;
        defaultLogger.noConflict = function() {
            if (typeof window !== undefinedType &&
                   window.log === defaultLogger) {
                window.log = _log;
            }

            return defaultLogger;
        };

        defaultLogger.getLoggers = function getLoggers() {
            return _loggersByName;
        };

        return defaultLogger;
    }));

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
            this.forEach((value, k) => {
                if (key.toLowerCase() === k.toLowerCase()) {
                    return value;
                }
            });
            return null;
        }
    }

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
            const logger = undefined("ArgumentMatcher");
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
            this.logger = undefined("LookupResolver");
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
            this.logger = undefined("InputParser");
            this.legalQuotes = legalQuotes;
            this.pattern = this.generateMatcher();
        }
        static escapeRegexCharacter(str) {
            return `\\Q${str}\\E`;
        }
        /**
         * Parses an input string.
         *
         * @param input Input string to parse.
         * @return Path list.
         */
        parse(input) {
            this.logger.debug("Parsing input '{}'", input);
            // @ts-ignore Can be converted to array, despite what TS says.
            return Array.from(input.match(this.pattern));
        }
        generateMatcher() {
            const matchBase = "(\\S+)";
            this.logger.debug("Creating matcher.");
            const matchItems = this.legalQuotes
                .map(InputParser.escapeRegexCharacter)
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
            this.logger = undefined("Clingy");
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
                value.alias.forEach((alias) => {
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
