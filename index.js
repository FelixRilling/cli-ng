"use strict";

const similar = require("similar-strings");
const getAliasedMap = require("./lib/getAliasedMap");
const mapArgs = require("./lib/mapArgs");
const parseString = require("./lib/parseString");
const {
    defaultsDeep
} = require("lodash");
const {
    objDefaults,
    objEntries,
    isString,
    arrClone
} = require("lightdash");

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
    validQuotes: ["\""],
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
        default: null,
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
 * Creates a map and submaps out of a command object
 *
 * @private
 * @param {Array<Entry>} commandEntries
 * @returns {Map}
 */
const mapCommands = (commandEntries, caseSensitive) => new Map(commandEntries.map((command, index) => {
    if (isString(command[0])) {
        /**
         * Key: make lowercase unless caseSensitive is enabled
         * Value: merge with default command structure and add key as name property
         */
        const commandKey = caseSensitive ? command[0] : command[0].toLowerCase();
        const commandValue = defaultsDeep(command[1], commandDefaultFactory(index));

        //Save key as name property to keep track in aliases
        commandValue.name = commandKey;
        //Merge each arg with default arg structure
        commandValue.args = commandValue.args.map((arg, index) => objDefaults(arg, argDefaultFactory(index)));

        //If sub-groups exist, recurse by creating a new Clingy instance
        if (commandValue.sub !== null) {
            commandValue.sub = new Clingy(commandValue.sub);
        }

        return [commandKey, commandValue];
    } else {
        throw new TypeError(`command key '${command[0]}' is not a string`, command);
    }
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
    constructor(commands, options) {
        this.options = defaultsDeep(options, optionsDefault);
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
        const commandNameCurrent = this.options.caseSensitive ? path[0] : path[0].toLowerCase();

        /**
         * Flow:
         *   Exists in current instance?
         *      true-> Has more path entries and contains sub-groups?
         *          true-> Is sub-group getCommand successful?
         *              true-> Return sub-group result
         *              false-> Return current result
         *          false-> Return current result
         *      false-> Return Error
         */
        if (this.mapAliased.has(commandNameCurrent)) {
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
        } else {
            return {
                success: false,
                error: {
                    type: "missingCommand",
                    missing: commandNameCurrent,
                    similar: similar(commandNameCurrent, arrClone(this.mapAliased.keys()))
                },
                path: pathUsedNew
            };
        }
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
        const command = commandLookup.command;
        const args = commandLookup.pathDangling;

        if (commandLookup.success) {
            const argsMapped = mapArgs(command.args, args);

            if (argsMapped.missing.length !== 0) {
                //Error:Missing arguments
                return {
                    success: false,
                    error: {
                        type: "missingArg",
                        missing: argsMapped.missing
                    }
                };
            } else {
                commandLookup.args = argsMapped.args;

                //Success
                return commandLookup;
            }
        } else {
            //Error:Command not found
            return commandLookup;
        }
    }
};

module.exports = Clingy;
