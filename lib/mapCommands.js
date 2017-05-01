"use strict";

const _isArray = require("lodash/isArray");
const _isObject = require("lodash/isObject");

/**
 * Replaces value with empty array if its not an array
 * @private
 * @param {Array} arr
 * @returns {Array}
 */
const setDefaultIfNotArr = arr => _isArray(arr) ? arr : [];

/**
 * Creates a map and submaps out of a command object
 * @private
 * @param {Object} commands
 * @param {Clingy} Clingy
 * @returns {Map}
 */
module.exports = function (commands, Clingy, options) {
    const entries = Object.entries(commands);
    const entriesProccessed = entries.map(command => {
        const commandKey = options.caseSensitive ? command[0] : command[0].toLowerCase();
        const commandValue = command[1];

        //Saves name to keep track in aliases
        commandValue.name = commandKey;

        //Sets args and alias to default if given values dont fit
        commandValue.args = setDefaultIfNotArr(commandValue.args);
        commandValue.alias = setDefaultIfNotArr(commandValue.alias);

        if (commandValue.sub && _isObject(commandValue.sub)) {
            commandValue.sub = new Clingy(commandValue.sub); //Create a sub-instance for subgroups
        }

        return [commandKey, commandValue];
    });

    return new Map(entriesProccessed);
};
