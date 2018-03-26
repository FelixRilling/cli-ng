var clingy = (function () {
    'use strict';

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
    const isTypeOf = (val, type) => typeof val === type;
    /**
     * Checks if a value is an array.
     *
     * `Array.isArray` shorthand.
     *
     * @function isArray
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @returns {boolean}
     * @example
     * isArray([]);
     * // => true
     *
     * isArray([1, 2, 3]);
     * // => true
     *
     * @example
     * isArray({});
     * // => false
     */


    const isArray = Array.isArray;
    /**
     * Checks if a value is undefined.
     *
     * @function isUndefined
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @returns {boolean}
     * @example
     * const a = {};
     *
     * isUndefined(a.b)
     * // => true
     *
     * isUndefined(undefined)
     * // => true
     *
     * @example
     * const a = {};
     *
     * isUndefined(1)
     * // => false
     *
     * isUndefined(a)
     * // => false
     */


    const isUndefined = val => isTypeOf(val, "undefined");
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


    const isNil = val => isUndefined(val) || val === null;
    /**
     * Checks if a value is not nil and has a type of object.
     *
     * The main difference to isObject is that functions are not considered object-like,
     * because `typeof function(){}` returns "function".
     *
     * @function isObjectLike
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @returns {boolean}
     * @example
     * isObjectLike({})
     * // => true
     *
     * isObjectLike([])
     * // => true
     *
     * @example
     * isObjectLike(1)
     * // => false
     *
     * isObjectLike(() => 1))
     * // => false
     */


    const isObjectLike = val => !isNil(val) && isTypeOf(val, "object");
    /**
     * Iterates over each entry of an object
     *
     * @function forEachEntry
     * @memberof For
     * @param {object} obj
     * @param {function} fn fn(key: any, val: any, index: number, arr: any[])
     * @example
     * const a = {a: 1, b: 2};
     *
     * forEachEntry(a, (key, val, index) => a[key] = val * index)
     * // a = {a: 0, b: 2}
     */


    const forEachEntry = (obj, fn) => {
      Object.entries(obj).forEach((entry, index) => {
        fn(entry[0], entry[1], index, obj);
      });
    };
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
     * @example
     * isString(1)
     * // => false
     */


    const isString = val => isTypeOf(val, "string");
    /**
     * Creates a new object with the entries of the input object.
     *
     * @function objFrom
     * @memberof Object
     * @since 1.0.0
     * @param {Object} obj
     * @returns {Object}
     * @example
     * const a = {a: 4, b: 2};
     * const b = objFrom(a);
     *
     * b.a = 10;
     * // a = {a: 4, b: 2}
     * // b = {a: 10, b: 2}
     */


    const objFrom = obj => Object.assign({}, obj);
    /**
     * Sets every nil property of object to the value from the default object.
     *
     * @function objDefaults
     * @memberof Object
     * @since 2.6.0
     * @param {Object} obj
     * @param {Object} objDefault
     * @returns {Object}
     * @example
     * objDefaults({a: 1, c: 5}, {a: 1, b: 2, c: 3})
     * // => {a: 1, b: 2, c: 5}
     */


    const objDefaults = (obj, objDefault) => {
      const result = isArray(obj) ? Array.from(obj) : objFrom(obj);
      forEachEntry(objDefault, (keyDefault, valDefault) => {
        if (isUndefined(obj[keyDefault])) {
          result[keyDefault] = valDefault;
        }
      });
      return result;
    };
    /**
     * Maps each entry of an object and returns the result.
     *
     * @function objMap
     * @memberof Object
     * @since 1.0.0
     * @param {Object} obj
     * @param {function} fn fn(key: any, val: any, index: number, arr: any[])
     * @returns {Object}
     * @example
     * objMap({a: 4, b: 2}, (key, val) => val * 2)
     * // => {a: 8, b: 4}
     */


    const objMap = (obj, fn) => {
      const objNew = {};
      forEachEntry(obj, (key, val, index) => {
        objNew[key] = fn(key, val, index, obj);
      });
      return objNew;
    };
    /**
     * Recursively maps each entry of an object and returns the result.
     *
     * @function objMapDeep
     * @memberof Object
     * @since 1.0.0
     * @param {Object} obj
     * @param {function} fn fn(key: any, val: any, index: number, arr: any[])
     * @returns {Object}
     * @example
     * arrMapDeep({a: {b: 2, c: [10, 20]}}, (key, val) => val * 2)
     * // => {a: {b: 4, c: [20, 40]}}
     */


    const objMapDeep = (obj, fn) => objMap(obj, (key, val, index, objNew) => isObjectLike(val) ? objMapDeep(val, fn) : fn(key, val, index, objNew));
    /**
     * Deeply creates a new object with the entries of the input object.
     *
     * @function objFromDeep
     * @memberof Object
     * @since 1.0.0
     * @param {Object} obj
     * @returns {Object}
     * @example
     * const a = {a: {b: 2, c: {a: 10, b: 20}}};
     * const b = objFromDeep(a);
     *
     * b.a.c.a = 123;
     * // a = {a: {b: 2, c: {a: 10, b: 20}}
     * // b = {a: {b: 2, c: {a: 123, b: 20}}}
     */


    const objFromDeep = obj => objMapDeep(objFrom(obj), (key, val) => isObjectLike(val) ? objFrom(val) : val);
    /**
     * Recursively sets every nil property of object to the value from the default object.
     *
     * @function objDefaultsDeep
     * @memberof Object
     * @since 2.7.0
     * @param {Object} obj
     * @param {Object} objDefault
     * @returns {Object}
     * @example
     * objDefaultsDeep({a: [1, 2], c: {f: "x"}}, {a: [1, 2, 3], b: 2, c: {f: "y"}})
     * // => {a: [1, 2, 3], b: 2, c: {f: "x"}}
     */


    const objDefaultsDeep = (obj, objDefault) => {
      const result = isArray(obj) ? Array.from(obj) : objFromDeep(obj);
      forEachEntry(objDefault, (keyDefault, valDefault) => {
        const valGiven = obj[keyDefault];

        if (isObjectLike(valDefault)) {
          result[keyDefault] = isObjectLike(valGiven) ? objDefaultsDeep(valGiven, valDefault) : valDefault;
        } else {
          result[keyDefault] = isUndefined(valGiven) ? valDefault : valGiven;
        }
      });
      return result;
    };

    /**
     * Calculate levenshtein string distance
     *
     * @param {string} str1 Input string 1
     * @param {string} str2 Input string 2
     * @returns {number} String distance
     */
    const levenshteinStringDistance = (str1, str2) => {
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
      } // Create matrix that is (str2.length+1)x(str1.length+1) fields


      const matrix = []; // Increment along the first column of each row

      for (let y = 0; y <= str2Length; y++) {
        matrix[y] = [y];
      } // Increment each column in the first row


      for (let x = 0; x <= str1Length; x++) {
        matrix[0][x] = x;
      } // Fill matrix


      for (let y = 1; y <= str2Length; y++) {
        const matrixColumnCurrent = matrix[y];
        const matrixColumnLast = matrix[y - 1];

        for (let x = 1; x <= str1Length; x++) {
          if (str2.charAt(y - 1) === str1.charAt(x - 1)) {
            // Check if letter at the position is the same
            matrixColumnCurrent[x] = matrixColumnLast[x - 1];
          } else {
            // Check for substitution/insertion/deletion
            const substitution = matrixColumnLast[x - 1] + 1;
            const insertion = matrixColumnCurrent[x - 1] + 1;
            const deletion = matrixColumnLast[x] + 1; // Get smallest of the three

            matrixColumnCurrent[x] = Math.min(substitution, insertion, deletion);
          }
        }
      } // Return max value


      return matrix[str2Length][str1Length];
    };

    /**
     * Returns value of the smallest key in an object
     *
     * @private
     * @param  {Object} obj
     * @returns {any}
     */

    const getLowestKeyValue = obj => {
      const keys = Object.keys(obj).map(key => Number(key)); // Get Array of keys as numbers

      const lowestKey = Math.min(...keys);
      return obj[lowestKey];
    };
    /**
     * Get closest match to string
     *
     * @param {string} str String to compare
     * @param {Array<string>} list List of strings to check
     * @param {boolean} [returnFull=false] If the whole result should be returned instead of just the lowest matches
     * @returns {Array<string>|Object} Lowest distance strings or full result, depending on the value of returnFull
     */


    const similarStrings = (str, list, returnFull = false) => {
      const result = {};
      list.forEach(listItem => {
        const listItemDistance = levenshteinStringDistance(str, listItem); // Create new array in result if it doesn't exist for this distance

        if (!result[listItemDistance]) {
          result[listItemDistance] = [listItem];
        } else {
          result[listItemDistance].push(listItem);
        }
      });
      return returnFull ? result : getLowestKeyValue(result);
    };

    /**
     * Default argument structure
     *
     * @private
     * @param {Object} arg
     * @param {number} index
     * @returns {Object}
     */
    const argDefaultFactory = index => {
      return {
        name: `arg${index}`,
        required: true,
        default: null
      };
    };

    /**
     * Default command structure
     *
     * @private
     * @param {Object} arg
     * @param {number} index
     * @returns {Object}
     */
    const commandDefaultFactory = index => {
      return {
        name: `command${index}`,
        fn: () => {},
        alias: [],
        args: [],
        sub: null
      };
    };

    /**
     * Creates an aliased map from a normal map
     *
     * @private
     * @param {Map} map
     * @returns {Map}
     */
    const getAliasedMap = map => {
      const result = new Map(map);
      map.forEach(command => {
        command.alias.forEach(alias => {
          if (result.has(alias)) {
            throw new Error(`Alias ${alias} conflicts with a previously defined key`);
          } else {
            result.set(alias, command);
          }
        });
      });
      return result;
    };

    /**
     * Matches command-map arguments with input args
     *
     * @private
     * @param {Array<Object>} expectedArgs
     * @param {Array<Object>} givenArgs
     * @returns {Object}
     */
    const mapArgs = (expectedArgs, givenArgs) => {
      const result = {
        args: {
          _all: givenArgs // Special arg that contains all other args

        },
        missing: []
      };
      expectedArgs.forEach((expectedArg, index) => {
        const givenArg = givenArgs[index];

        if (givenArg) {
          // Arg exists
          result.args[expectedArg.name] = givenArg;
        } else {
          // Arg doesn't exist
          if (!expectedArg.required) {
            // Use default value
            result.args[expectedArg.name] = expectedArg.default;
          } else {
            // Mark as missing
            result.missing.push(expectedArg);
          }
        }
      });
      return result;
    };

    const SPACE = /\s/;
    /**
     * Parses a string into an Array while supporting quoted strings
     *
     * @private
     * @param {string} str
     * @param {Array<string>} validQuotes
     * @returns {Array<string>}
     */

    const splitWithQuotedStrings = (str, validQuotes) => {
      const result = [];
      let partStr = [];
      let inString = false;
      str.split("").forEach((letter, index) => {
        const isSpace = SPACE.test(letter);

        if (validQuotes.includes(letter)) {
          // Toggle inString once a quote is encountered
          inString = !inString;
        } else if (inString || !isSpace) {
          // Push everything thats not a quote or a space(if outside quotes)
          partStr.push(letter);
        }

        if (partStr.length > 0 && isSpace && !inString || index === str.length - 1) {
          // Push current arg to container
          result.push(partStr.join(""));
          partStr = [];
        }
      });
      return result;
    };
    /**
     * Parses a string into an Array
     *
     * @private
     * @param {string} strInput
     * @param {Array<string>|null} validQuotes
     * @returns {Array<string>}
     */


    const parseString = (strInput, validQuotes) => {
      const str = strInput.trim(); // Only use the 'complex' algorithm if allowQuotedStrings is true

      return validQuotes !== null ? splitWithQuotedStrings(str, validQuotes) : str.split(SPACE);
    };

    const optionsDefault = {
      /**
       * If names should be treated case-sensitive for lookup
       */
      caseSensitive: true,

      /**
       * List of characters to allow as quote-enclosing string
       * If set to null, quotes-enclosed strings will be disabled
       */
      validQuotes: ['"']
    };
    /**
     * Creates a map and sub-maps out of a command object
     *
     * @private
     * @param {Array<IClingyCommand>} commandEntries
     * @returns {Map}
     */

    const mapCommands = (commandEntries, caseSensitive) => new Map(commandEntries.map((command, index) => {
      if (!isString(command[0])) {
        throw new TypeError(`command key '${command[0]}' is not a string`);
      }

      const commandKey = caseSensitive ? command[0] : command[0].toLowerCase();
      const commandValue = objDefaultsDeep(command[1], commandDefaultFactory(index)); // Save key as name property to keep track in aliases

      commandValue.name = commandKey; // Merge each arg with default arg structure

      commandValue.args = commandValue.args.map((arg, argIndex) => objDefaults(arg, argDefaultFactory(argIndex))); // If sub-groups exist, recurse by creating a new Clingy instance

      if (commandValue.sub !== null) {
        commandValue.sub = new Clingy(commandValue.sub);
      }

      return [commandKey, commandValue];
    }));
    /**
     * Clingy class
     *
     * @class
     */


    const Clingy = class {
      /**
       * Creates Clingy instance
       *
       * @constructor
       * @param {Object} commands
       * @param {Object} options
       */
      constructor(commands = {}, options = {}) {
        this.options = objDefaultsDeep(options, optionsDefault);
        this.map = mapCommands(Object.entries(commands), this.options.caseSensitive);
        this.mapAliased = getAliasedMap(this.map);
      }
      /**
       * Returns all instance maps
       *
       * @returns {Object}
       */


      getAll() {
        return {
          map: this.map,
          mapAliased: this.mapAliased
        };
      }
      /**
       * Looks up a command by path
       *
       * @param {Array<string>} path
       * @param {Array<string>} [pathUsed=[]]
       * @returns {Object}
       */


      getCommand(path, pathUsed = []) {
        if (path.length < 1) {
          throw new Error("Path does not contain at least one item");
        }

        const commandNameCurrent = this.options.caseSensitive ? path[0] : path[0].toLowerCase();
        const pathUsedNew = pathUsed;

        if (!this.mapAliased.has(commandNameCurrent)) {
          return {
            success: false,
            error: {
              type: "missingCommand",
              missing: [commandNameCurrent],
              similar: similarStrings(commandNameCurrent, Array.from(this.mapAliased.keys()))
            },
            path: pathUsedNew
          };
        }

        const command = this.mapAliased.get(commandNameCurrent);
        const commandPathNew = path.slice(1);
        pathUsedNew.push(commandNameCurrent); // Recurse into sub if more items in path and sub exists

        if (path.length > 1 && command.sub !== null) {
          const commandSubResult = command.sub.getCommand(commandPathNew, pathUsedNew);

          if (commandSubResult.success) {
            return commandSubResult;
          }
        }

        return {
          success: true,
          command,
          path: pathUsedNew,
          pathDangling: commandPathNew
        };
      }
      /**
       * Parses a CLI-like input string into command and args
       *
       * @param {string} input
       * @returns {Object}
       */


      parse(input) {
        const inputParsed = parseString(input, this.options.validQuotes);
        const commandLookup = this.getCommand(inputParsed);

        if (!commandLookup.success) {
          // Error: Command not found
          return commandLookup;
        }

        const command = commandLookup.command;
        const args = commandLookup.pathDangling;
        const argsMapped = mapArgs(command.args, args);

        if (argsMapped.missing.length !== 0) {
          // Error: Missing arguments
          return {
            success: false,
            error: {
              type: "missingArg",
              missing: argsMapped.missing
            }
          };
        }

        commandLookup.args = argsMapped.args; // Success

        return commandLookup;
      }

    };

    return Clingy;

}());
//# sourceMappingURL=clingy.js.map
