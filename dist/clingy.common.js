'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var similar = _interopDefault(require('similar-strings'));
var lightdash = require('lightdash');

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
        fn: null,
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
    validQuotes: ['"']
};
/**
 * Creates a map and submaps out of a command object
 *
 * @private
 * @param {Array<IClingyCommand>} commandEntries
 * @returns {Map}
 */
const mapCommands = (commandEntries, caseSensitive) => new Map(commandEntries.map((command, index) => {
    if (!lightdash.isString(command[0])) {
        throw new TypeError(`command key '${command[0]}' is not a string`);
    }
    /**
     * Key: make lowercase unless caseSensitive is enabled
     * Value: merge with default command structure and add key as name property
     */
    const commandKey = caseSensitive
        ? command[0]
        : command[0].toLowerCase();
    const commandValue = lightdash.objDefaultsDeep(command[1], commandDefaultFactory(index));
    //Save key as name property to keep track in aliases
    commandValue.name = commandKey;
    //Merge each arg with default arg structure
    commandValue.args = commandValue.args.map((arg, index) => lightdash.objDefaults(arg, argDefaultFactory(index)));
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
    constructor(commands, options = {}) {
        this.options = lightdash.objDefaultsDeep(options, optionsDefault);
        this.map = mapCommands(lightdash.objEntries(commands), this.options.caseSensitive);
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
                    missing: commandNameCurrent,
                    similar: similar(commandNameCurrent, lightdash.arrFrom(this.mapAliased.keys()))
                },
                path: pathUsedNew
            };
        }
        const command = this.mapAliased.get(commandNameCurrent);
        const commandPathNew = path.slice(1);
        pathUsedNew.push(commandNameCurrent);
        //Recurse into sub if more items in path and sub exists
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
};

module.exports = Clingy;
