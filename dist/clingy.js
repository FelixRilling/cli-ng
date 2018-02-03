var clingy = (function () {
'use strict';

/**
 * Calculate levenshtein string distance
 *
 * @param {string} str1 Input string 1
 * @param {string} str2 Input string 2
 * @returns {number} String distance
 */
const levenshteinStringDistance = (str1, str2) => {
    // Cache string length
    const str1_l = str1.length;
    const str2_l = str2.length;
    if (str1_l === 0) {
        // Exit early if str1 is empty
        return str2_l;
    }
    else if (str2_l === 0) {
        // Exit early if str2 is empty
        return str1_l;
    }
    else {
        // Create matrix that is (str2.length+1)x(str1.length+1) fields
        const matrix = [];
        // Increment along the first column of each row
        for (let y = 0; y <= str2_l; y++) {
            matrix[y] = [y];
        }
        // Increment each column in the first row
        for (let x = 0; x <= str1_l; x++) {
            matrix[0][x] = x;
        }
        // Fill matrix
        for (let y = 1; y <= str2_l; y++) {
            const matrix_column_current = matrix[y];
            const matrix_column_last = matrix[y - 1];
            for (let x = 1; x <= str1_l; x++) {
                if (str2.charAt(y - 1) === str1.charAt(x - 1)) {
                    // Check if letter at the position is the same
                    matrix_column_current[x] = matrix_column_last[x - 1];
                }
                else {
                    // Check for substitution/insertion/deletion
                    const substitution = matrix_column_last[x - 1] + 1;
                    const insertion = matrix_column_current[x - 1] + 1;
                    const deletion = matrix_column_last[x] + 1;
                    // Get smallest of the three
                    matrix_column_current[x] = Math.min(substitution, insertion, deletion);
                }
            }
        }
        // Return max value
        return matrix[str2_l][str1_l];
    }
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
 * // returns true
 * isTypeOf({}, "object")
 * isTypeOf([], "object")
 * isTypeOf("foo", "string")
 *
 * @example
 * // returns false
 * isTypeOf("foo", "number")
 */
const isTypeOf = (val, type) => typeof val === type;

const _Object = Object;
const _Array = Array;
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
 * // returns true
 * isArray([]);
 * isArray([1, 2, 3]);
 *
 * @example
 * // returns false
 * isArray({});
 */
const isArray = _Array.isArray;

/**
 * Checks if a value is undefined.
 *
 * @function isUndefined
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns false
 * const a = {};
 *
 * isUndefined(a.b)
 * isUndefined(undefined)
 *
 * @example
 * // returns false
 * const a = {};
 *
 * isUndefined(1)
 * isUndefined(a)
 */
const isUndefined = (val) => isTypeOf(val, "undefined");

/**
 * Checks if a value is defined.
 *
 * @function isDefined
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * const a = {};
 *
 * isDefined(1)
 * isDefined(a)
 *
 * @example
 * // returns false
 * const a = {};
 *
 * isDefined(a.b)
 * isDefined(undefined)
 */
const isDefined = (val) => !isUndefined(val);

/**
 * Checks if a target has a certain key.
 *
 * @function hasKey
 * @memberof Has
 * @since 1.0.0
 * @param {any} target
 * @param {string} key
 * @returns {boolean}
 * @example
 * // returns true
 * hasKey([1, 2, 3], "0")
 * hasKey({foo: 0}, "foo")
 * hasKey("foo", "replace")
 *
 * @example
 * // returns false
 * hasKey({}, "foo")
 */
const hasKey = (target, key) => isDefined(target[key]);

/**
 * Checks if a value is undefined or null.
 *
 * @function isNil
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * isNil(null)
 * isNil(undefined)
 *
 * @example
 * // returns false
 * isNil(0)
 * isNil({})
 */
const isNil = (val) => isUndefined(val) || val === null;

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
 * // returns true
 * isObjectLike({})
 * isObjectLike([])
 *
 * @example
 * // returns false
 * isObjectLike(1)
 * isObjectLike(() => 1))
 */
const isObjectLike = (val) => !isNil(val) && isTypeOf(val, "object");

/**
 * Returns an array of the objects keys.
 *
 * `Object.keys` shorthand.
 *
 * @function objKeys
 * @memberof Object
 * @since 1.0.0
 * @param {Object} obj
 * @returns {any[]}
 * @example
 * // returns ["a", "b", "c"]
 * objKeys({a: 1, b: 2, c: 3})
 */
const objKeys = _Object.keys;

/**
 * Returns an array of the objects entries.
 *
 * `Object.entries` shorthand.
 *
 * @function objEntries
 * @memberof Object
 * @since 1.0.0
 * @param {Object} obj
 * @returns {any[]} Array<[key: any, val: any]>]
 * @example
 * // returns [["a", 1], ["b", 2], ["c", 3]]
 * objEntries({a: 1, b: 2, c: 3})
 */
const objEntries = _Object.entries;

/**
 * Iterates over each element in an array
 *
 * Wrapper around arr.forEach to have a cleaner API and better minified code
 *
 * @function forEach
 * @memberof For
 * @param {any[]} arr
 * @param {function} fn fn(val: any, index: number, arr: any[])
 * @example
 * // returns a = [0, 2, 6]
 * const a = [1, 2, 3];
 *
 * forEach(a, (val, index)=>a[index] = val * index)
 */
const forEach = (arr, fn) => arr.forEach(fn);

/**
 * Iterates over each entry of an object
 *
 * @function forEachEntry
 * @memberof For
 * @param {object} obj
 * @param {function} fn fn(key: any, val: any, index: number, arr: any[])
 * @example
 * // returns a = {a: 0, b: 2}
 * const a = {a: 1, b: 2};
 *
 * forEachEntry(a, (key, val, index) => a[key] = val * index)
 */
const forEachEntry = (obj, fn) => {
    forEach((objEntries(obj)), (entry, index) => {
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
 * // returns true
 * isString("foo")
 *
 * @example
 * // returns false
 * isString(1)
 */
const isString = (val) => isTypeOf(val, "string");

/**
 * Creates a new array with the values of the input iterable.
 *
 * `Array.from` shorthand.
 *
 * @function arrFrom
 * @memberof Array
 * @since 1.0.0
 * @param {any} arr
 * @returns {any[]}
 * @example
 * // returns a = [1, 2, 3], b = [1, 10, 3]
 * const a = [1, 2, 3];
 * const b = arrFrom(a);
 *
 * b[1] = 10;
 */
const arrFrom = _Array.from;

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
 * // returns a = {a: 8, b: 4}
 * objMap({a: 4, b: 2}, (key, val) => val * 2)
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
 * // returns {a: {b: 4, c: [20, 40]}}
 * arrMapDeep({a: {b: 2, c: [10, 20]}}, (key, val) => val * 2)
 */
const objMapDeep = (obj, fn) => objMap(obj, (key, val, index, objNew) => isObjectLike(val) ?
    objMapDeep(val, fn) :
    fn(key, val, index, objNew));

/**
 * Merges contents of two objects.
 *
 * `Object.assign` shorthand.
 *
 * @function objMerge
 * @memberof Object
 * @since 2.7.0
 * @param {Object} obj
 * @param {Object} objSecondary
 * @returns {Object}
 * @example
 * // returns {a: 1, b: 2}
 * objMerge({a: 1}, {b: 2})
 */
const objMerge = _Object.assign;

/**
 * Creates a new object with the entries of the input object.
 *
 * @function objFrom
 * @memberof Object
 * @since 1.0.0
 * @param {object} obj
 * @returns {object}
 * @example
 * // returns a = {a: 4, b: 2}, b = {a: 10, b: 2}
 * const a = {a: 4, b: 2};
 * const b = objFrom(a);
 *
 * b.a = 10;
 */
const objFrom = (obj) => objMerge({}, obj);

/**
 * Deeply creates a new object with the entries of the input object.
 *
 * @function objFromDeep
 * @memberof Object
 * @since 1.0.0
 * @param {Object} obj
 * @returns {Object}
 * @example
 * // returns a = {a: {b: 2, c: {a: 10, b: 20}}, b = {a: {b: 2, c: {a: 123, b: 20}}}
 * const a = {a: {b: 2, c: {a: 10, b: 20}}};
 * const b = objFromDeep(a);
 *
 * b.a.c.a = 123;
 */
const objFromDeep = (obj) => objMapDeep(objFrom(obj), (key, val) => isObjectLike(val) ?
    objFrom(val) :
    val);

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
 * // returns a = {a: 1, b: 2, c: 5}
 * objDefaults({a: 1, c: 5}, {a: 1, b: 2, c: 3})
 */
const objDefaults = (obj, objDefault) => {
    const result = isArray(obj) ? arrFrom(obj) : objFrom(obj);
    forEachEntry(objDefault, (keyDefault, valDefault) => {
        if (!hasKey(obj, keyDefault)) {
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
 * // returns a = {a: [1, 2, 3], b: 2, c: {f: "x"}}
 * objDefaultsDeep({a: [1, 2], c: {f: "x"}}, {a: [1, 2, 3], b: 2, c: {f: "y"}})
 */
const objDefaultsDeep = (obj, objDefault) => {
    const result = isArray(obj) ? arrFrom(obj) : objFromDeep(obj);
    forEachEntry(objDefault, (keyDefault, valDefault) => {
        const valGiven = obj[keyDefault];
        if (isObjectLike(valDefault)) {
            result[keyDefault] =
                isObjectLike(valGiven)
                    ? objDefaultsDeep(valGiven, valDefault)
                    : valDefault;
        }
        else {
            result[keyDefault] = isUndefined(valGiven) ? valDefault : valGiven;
        }
    });
    return result;
};

/**
 * Returns value of the smallest key in an object
 *
 * @private
 * @param  {Object} obj
 * @returns {any}
 */
const getLowestKeyValue = (obj) => {
    const keys = objKeys(obj).map((key) => Number(key)); // Get Array of keys as numbers
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
        const listItemDistance = levenshteinStringDistance(str, listItem);
        // Create new array in result if it doesn't exist for this distance
        if (!result[listItemDistance]) {
            result[listItemDistance] = [listItem];
        }
        else {
            result[listItemDistance].push(listItem);
        }
    });
    return returnFull ? result : getLowestKeyValue(result);
};

/**
 * Creates an aliased map from a normal map
 *
 * @private
 * @param {Map} map
 * @returns {Map}
 */
const getAliasedMap = (map) => {
    const result = new Map(map);
    map.forEach((command) => {
        command.alias.forEach((alias) => {
            if (result.has(alias)) {
                throw new Error(`Alias ${alias} conflicts with a previously defined key`);
            }
            else {
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
        }
        else {
            // Arg doesn't exist
            if (!expectedArg.required) {
                // Use default value
                result.args[expectedArg.name] = expectedArg.default;
            }
            else {
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
            //Toggle inString once a quote is encountered
            inString = !inString;
        }
        else if (inString || !isSpace) {
            //push everything thats not a quote or a space(if outside quotes)
            partStr.push(letter);
        }
        if ((partStr.length > 0 && isSpace && !inString) ||
            index === str.length - 1) {
            //push current arg to container
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
    const str = strInput.trim();
    // Only use the 'complex' algorithm if allowQuotedStrings is true
    return validQuotes !== null
        ? splitWithQuotedStrings(str, validQuotes)
        : str.split(SPACE);
};

/**
 * Default argument structure
 *
 * @private
 * @param {Object} arg
 * @param {number} index
 * @returns {Object}
 */
const argDefaultFactory = (index) => {
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
const commandDefaultFactory = (index) => {
    return {
        name: `command${index}`,
        fn: () => { },
        alias: [],
        args: [],
        sub: null
    };
};

/**
 * Default option structure
 */
const optionsDefault = {
    /**
     * If names should be treated case-sensitive for lookup
     */
    caseSensitive: true,
    /**
     * List of characters to allow as quote-enclosing string
     * If set to null, quotes-enclosed strings will be disabled
     */
    validQuotes: ["\""]
};
/**
 * Creates a map and submaps out of a command object
 *
 * @private
 * @param {Array<IClingyCommand>} commandEntries
 * @returns {Map}
 */
const mapCommands = (commandEntries, caseSensitive) => new Map(commandEntries.map((command, index) => {
    if (!isString(command[0])) {
        throw new TypeError(`command key '${command[0]}' is not a string`);
    }
    const commandKey = caseSensitive
        ? command[0]
        : command[0].toLowerCase();
    const commandValue = objDefaultsDeep(command[1], commandDefaultFactory(index));
    // Save key as name property to keep track in aliases
    commandValue.name = commandKey;
    // Merge each arg with default arg structure
    commandValue.args = commandValue.args.map((arg, index) => objDefaults(arg, argDefaultFactory(index)));
    //If sub-groups exist, recurse by creating a new Clingy instance
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
     * @param {Object} commands Command object
     * @param {Object} options Option object
     */
    constructor(commands = {}, options = {}) {
        this.options = objDefaultsDeep(options, optionsDefault);
        this.map = mapCommands(objEntries(commands), this.options.caseSensitive);
        this.mapAliased = getAliasedMap(this.map);
    }
    /**
     * Returns internal maps
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
     * Recursiveley searches a command
     *
     * @param {Array<string>} path Array of strings indicating the path to get
     * @param {Array<string>} [pathUsed=[]] Array of strings indicating the path that was taken so far
     * @returns {Object}
     */
    getCommand(path, pathUsed = []) {
        const pathUsedNew = pathUsed;
        const commandNameCurrent = this.options.caseSensitive
            ? path[0]
            : path[0].toLowerCase();
        if (!this.mapAliased.has(commandNameCurrent)) {
            return {
                success: false,
                error: {
                    type: "missingCommand",
                    missing: [commandNameCurrent],
                    similar: similarStrings(commandNameCurrent, arrFrom(this.mapAliased.keys()))
                },
                path: pathUsedNew
            };
        }
        const command = this.mapAliased.get(commandNameCurrent);
        const commandPathNew = path.slice(1);
        pathUsedNew.push(commandNameCurrent);
        // Recurse into sub if more items in path and sub exists
        if (path.length > 1 && command.sub !== null) {
            const commandSubResult = command.sub.getCommand(commandPathNew, pathUsedNew);
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
     * Parses a cli-input-string to command and args
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
        commandLookup.args = argsMapped.args;
        // Success
        return commandLookup;
    }
};

return Clingy;

}());
//# sourceMappingURL=clingy.js.map
