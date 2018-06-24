var Clingy = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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


  const isNil = val => val == null;
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
   * Iterates over each entry of an object.
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
    return returnFull ? result : result.get(Math.min(...result.keys()));
  };
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
    const result = isArray(obj) ? Array.from(obj) : objFrom(obj);
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
   * Default argument structure
   *
   * @private
   * @param {Object} arg
   * @param {number} index
   * @returns {Object}
   */
  var argDefaultFactory = function argDefaultFactory(index) {
    return {
      name: "arg".concat(index),
      required: true,
      default: null
    };
  };
  /**
   * Matches command-map arguments with input args
   *
   * @private
   * @param {Array<Object>} expectedArgs
   * @param {Array<Object>} givenArgs
   * @returns {Object}
   */


  var mapArgs = function mapArgs(expectedArgs, givenArgs) {
    var result = {
      args: {
        _all: givenArgs // Special arg that contains all other args

      },
      missing: []
    };
    expectedArgs.forEach(function (expectedArg, index) {
      var givenArg = givenArgs[index];

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

  /**
   * Default command structure
   *
   * @private
   * @param {Object} arg
   * @param {number} index
   * @returns {Object}
   */

  var commandDefaultFactory = function commandDefaultFactory(index) {
    return {
      name: "command".concat(index),
      fn: function fn() {},
      alias: [],
      args: [],
      sub: null
    };
  };
  /**
   * Creates a map and sub-maps out of a command object.
   *
   * @private
   * @param {Array<IClingyCommand>} commandEntries
   * @returns {Map}
   */


  var mapCommands = function mapCommands(commandEntries, caseSensitive) {
    return new Map(commandEntries.map(function (command, index) {
      if (!isString(command[0])) {
        throw new Error("command key '".concat(command[0], "' is not a string"));
      }

      var commandKey = caseSensitive ? command[0] : command[0].toLowerCase();
      var commandValue = objDefaultsDeep(command[1], commandDefaultFactory(index)); // Save key as name property to keep track in aliases

      commandValue.name = commandKey; // Merge each arg with default arg structure

      commandValue.args = commandValue.args.map(function (arg, argIndex) {
        return objDefaults(arg, argDefaultFactory(argIndex));
      }); // If sub-groups exist, recurse by creating a new Clingy instance

      if (commandValue.sub !== null) {
        commandValue.sub = new Clingy(commandValue.sub);
      }

      return [commandKey, commandValue];
    }));
  };

  /**
   * Creates an aliased map from a normal map
   *
   * @private
   * @param {Map} map
   * @returns {Map}
   */
  var getAliasedMap = function getAliasedMap(map) {
    var result = new Map(map);
    map.forEach(function (command) {
      command.alias.forEach(function (alias) {
        if (result.has(alias)) {
          throw new Error("Alias '".concat(alias, "' conflicts with a previously defined key"));
        } else {
          result.set(alias, command);
        }
      });
    });
    return result;
  };

  var optionsDefault = {
    /**
     * If names should be treated case-sensitive for lookup.
     */
    caseSensitive: false,

    /**
     * List of characters to allow as quote-enclosing string.
     * If set to null, quotes-enclosed strings will be disabled.
     */
    validQuotes: ["\"", "“", "”"]
  };

  var SPACE = /\s/;
  /**
   * Parses a string into an Array while supporting quoted strings
   *
   * @private
   * @param {string} str
   * @param {Array<string>} validQuotes
   * @returns {Array<string>}
   */

  var parseString = function parseString(str, validQuotes) {
    var result = [];
    var partStr = [];
    var isInString = false;
    str.trim().split("").forEach(function (letter, index) {
      var isSpace = SPACE.test(letter);

      if (validQuotes.includes(letter)) {
        isInString = !isInString;
      } else if (isInString || !isSpace) {
        partStr.push(letter);
      }

      if (partStr.length > 0 && isSpace && !isInString || index === str.length - 1) {
        result.push(partStr.join(""));
        partStr = [];
      }
    });
    return result;
  };

  /**
   * Clingy class.
   *
   * @public
   * @class
   */

  var Clingy =
  /*#__PURE__*/
  function () {
    /**
     * Creates Clingy instance.
     *
     * @public
     * @constructor
     * @param {Object} commands
     * @param {Object} [options={}]
     */
    function Clingy(commands) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Clingy);

      this.options = objDefaultsDeep(options, optionsDefault);
      this.map = mapCommands(Object.entries(commands), this.options.caseSensitive);
      this.mapAliased = getAliasedMap(this.map);
    }
    /**
     * Returns all instance maps.
     *
     * @public
     * @returns {Object}
     */


    _createClass(Clingy, [{
      key: "getAll",
      value: function getAll() {
        return {
          map: this.map,
          mapAliased: this.mapAliased
        };
      }
      /**
       * Looks up a command by path.
       *
       * @public
       * @param {Array<string>} path
       * @param {Array<string>} [pathUsed=[]]
       * @returns {Object}
       */

    }, {
      key: "getCommand",
      value: function getCommand(path) {
        var pathUsed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        if (path.length < 1) {
          throw new TypeError("Path does not contain at least one item");
        }

        var commandNameCurrent = this.options.caseSensitive ? path[0] : path[0].toLowerCase();
        var pathUsedNew = pathUsed;

        if (!this.mapAliased.has(commandNameCurrent)) {
          return {
            success: false,
            error: {
              type: "missingCommand"
              /* command */
              ,
              missing: [commandNameCurrent],
              similar: strSimilar(commandNameCurrent, Array.from(this.mapAliased.keys()))
            },
            path: pathUsedNew
          };
        }

        var command = this.mapAliased.get(commandNameCurrent);
        var commandPathNew = path.slice(1);
        pathUsedNew.push(commandNameCurrent); // Recursively go into sub if more items in path and sub exists

        if (path.length > 1 && command.sub !== null) {
          var commandSubResult = command.sub.getCommand(commandPathNew, pathUsedNew);

          if (commandSubResult.success) {
            return commandSubResult;
          }
        }

        return {
          success: true,
          command: command,
          path: pathUsedNew,
          pathDangling: commandPathNew
        };
      }
      /**
       * Parses a CLI-like input string into command and args.
       *
       * @public
       * @param {string} input
       * @returns {Object}
       */

    }, {
      key: "parse",
      value: function parse(input) {
        var inputParsed = parseString(input, this.options.validQuotes);
        var commandLookup = this.getCommand(inputParsed);

        if (!commandLookup.success) {
          return commandLookup; // Error: Command not found
        }

        var command = commandLookup.command;
        var args = commandLookup.pathDangling;
        var argsMapped = mapArgs(command.args, args);

        if (argsMapped.missing.length !== 0) {
          return {
            success: false,
            error: {
              type: "missingArg"
              /* arg */
              ,
              missing: argsMapped.missing
            }
          }; // Error: Missing arguments
        }

        commandLookup.args = argsMapped.args;
        return commandLookup; // Success
      }
    }]);

    return Clingy;
  }();

  return Clingy;

}());
//# sourceMappingURL=clingy.js.map
