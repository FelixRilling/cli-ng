"use strict";

const _merge = require("lodash/merge");

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
        const commandKey = options.lookup.namesAreCaseSensitive ? command[0] : command[0].toLowerCase();
        const commandValue = _merge(commandDefault(command, index), command[1]);

        //Save key as name property to keep track in aliases
        commandValue.name = commandKey;

        //Merge each arg with default arg structure
        commandValue.args = commandValue.args.map((arg, index) => _merge(argDefault(arg, index), arg));

        //If sub-groups exist, recurse by creating a new Clingy instance
        if (commandValue.sub !== null) {
            commandValue.sub = new Clingy(commandValue.sub);
        }

        return [commandKey, commandValue];
    };

    return new Map(Object.entries(commands).map(mapCommands));
};
