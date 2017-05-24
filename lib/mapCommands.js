"use strict";

const _merge = require("lodash/merge");

const commandDefault = function (name) {
    return {
        name, //Save names to keep track inside aliases
        fn: () => {},
        alias: [],
        args: [],
        opts: [],
        sub: null
    };
};

/**
 * Creates a map and submaps out of a command object
 * @private
 * @param {Object} commands
 * @param {Clingy} Clingy
 * @returns {Map}
 */
module.exports = function (commands, Clingy, options) {
    const mapCommands = function (command) {
        /**
         * Key: make lowercase unless caseSensitive is enabled
         * Value: merge with default structure and add key as name property
         */
        const commandKey = options.caseSensitive ? command[0] : command[0].toLowerCase();
        const commandValue = _merge(commandDefault(commandKey), command[1]);

        console.log(commandValue);

        //If subroups exist, recurse by creating a new Clingy instance
        if (commandValue.sub !== null) {
            commandValue.sub = new Clingy(commandValue.sub);
        }

        return [commandKey, commandValue];
    };

    return new Map(Object.entries(commands).map(mapCommands));
};
