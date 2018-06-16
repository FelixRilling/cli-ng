'use strict';

var lightdash = require('lightdash');

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
 * Creates a map and sub-maps out of a command object.
 *
 * @private
 * @param {Array<IClingyCommand>} commandEntries
 * @returns {Map}
 */
const mapCommands = (commandEntries, caseSensitive) => new Map(commandEntries.map((command, index) => {
    if (!lightdash.isString(command[0])) {
        throw new Error(`command key '${command[0]}' is not a string`);
    }
    const commandKey = caseSensitive
        ? command[0]
        : command[0].toLowerCase();
    const commandValue = (lightdash.objDefaultsDeep(command[1], commandDefaultFactory(index)));
    // Save key as name property to keep track in aliases
    commandValue.name = commandKey;
    // Merge each arg with default arg structure
    commandValue.args = commandValue.args.map((arg, argIndex) => (lightdash.objDefaults(arg, argDefaultFactory(argIndex))));
    // If sub-groups exist, recurse by creating a new Clingy instance
    if (commandValue.sub !== null) {
        commandValue.sub = new Clingy(commandValue.sub);
    }
    return [commandKey, commandValue];
}));

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

const optionsDefault = {
    /**
     * If names should be treated case-sensitive for lookup.
     */
    caseSensitive: false,
    /**
     * List of characters to allow as quote-enclosing string.
     * If set to null, quotes-enclosed strings will be disabled.
     */
    validQuotes: ['"', "“", "”"]
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
const parseString = (str, validQuotes) => {
    const result = [];
    let partStr = [];
    let isInString = false;
    str.trim()
        .split("")
        .forEach((letter, index) => {
        const isSpace = SPACE.test(letter);
        if (validQuotes.includes(letter)) {
            isInString = !isInString;
        }
        else if (isInString || !isSpace) {
            partStr.push(letter);
        }
        if ((partStr.length > 0 && isSpace && !isInString) ||
            index === str.length - 1) {
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
const Clingy = class {
    /**
     * Creates Clingy instance.
     *
     * @public
     * @constructor
     * @param {Object} commands
     * @param {Object} [options={}]
     */
    constructor(commands, options = {}) {
        this.options = lightdash.objDefaultsDeep(options, optionsDefault);
        this.map = mapCommands(Object.entries(commands), this.options.caseSensitive);
        this.mapAliased = getAliasedMap(this.map);
    }
    /**
     * Returns all instance maps.
     *
     * @public
     * @returns {Object}
     */
    getAll() {
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
    getCommand(path, pathUsed = []) {
        if (path.length < 1) {
            throw new TypeError("Path does not contain at least one item");
        }
        const commandNameCurrent = this.options.caseSensitive
            ? path[0]
            : path[0].toLowerCase();
        const pathUsedNew = pathUsed;
        if (!this.mapAliased.has(commandNameCurrent)) {
            return {
                success: false,
                error: {
                    type: "missingCommand",
                    missing: [commandNameCurrent],
                    similar: lightdash.strSimilar(commandNameCurrent, Array.from(this.mapAliased.keys()))
                },
                path: pathUsedNew
            };
        }
        const command = (this.mapAliased.get(commandNameCurrent));
        const commandPathNew = path.slice(1);
        pathUsedNew.push(commandNameCurrent);
        // Recursively go into sub if more items in path and sub exists
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
     * Parses a CLI-like input string into command and args.
     *
     * @public
     * @param {string} input
     * @returns {Object}
     */
    parse(input) {
        const inputParsed = parseString(input, this.options.validQuotes);
        const commandLookup = this.getCommand(inputParsed);
        if (!commandLookup.success) {
            return commandLookup; // Error: Command not found
        }
        const command = commandLookup.command;
        const args = commandLookup.pathDangling;
        const argsMapped = mapArgs(command.args, args);
        if (argsMapped.missing.length !== 0) {
            return {
                success: false,
                error: {
                    type: "missingArg",
                    missing: argsMapped.missing
                }
            }; // Error: Missing arguments
        }
        commandLookup.args = argsMapped.args;
        return commandLookup; // Success
    }
};

module.exports = Clingy;
