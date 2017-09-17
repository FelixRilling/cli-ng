"use strict";

const {
    defaults,
    defaultsDeep,
    isString
} = require("lodash");

/**
 * Default argument structure
 *
 * @param {Object} arg
 * @param {number} index
 * @returns {Object}
 */
const argDefault = function (arg, index) {
    return {
        name: `arg${index}`,
        required: true,
        default: null,
    };
};

/**
 * Default command structure
 *
 * @param {Object} arg
 * @param {number} index
 * @returns {Object}
 */
const commandDefault = function (command, index) {
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
 * @param {Object} commands
 * @param {Clingy} Clingy
 * @returns {Map}
 */
module.exports = function (commands, Clingy, options) {
    const mapCommands = function (command, index) {
        /**
         * Key: make lowercase unless caseSensitive is enabled
         * Value: merge with default command structure and add key as name property
         */

        if (isString(command[0])) {
            const commandKey = options.lookup.namesAreCaseSensitive ? command[0] : command[0].toLowerCase();
            const commandValue = defaultsDeep(command[1], commandDefault(command, index));

            //Save key as name property to keep track in aliases
            commandValue.name = commandKey;

            //Merge each arg with default arg structure
            commandValue.args = commandValue.args.map((arg, index) => defaults(arg, argDefault(arg, index)));

            //If sub-groups exist, recurse by creating a new Clingy instance
            if (commandValue.sub !== null) {
                commandValue.sub = new Clingy(commandValue.sub);
            }

            return [commandKey, commandValue];
        } else {
            throw new TypeError(`command key '${command[0]}' is not a string`, command);
        }
    };

    return new Map(Object.entries(commands).map(mapCommands));
};
