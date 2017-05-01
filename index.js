"use strict";

const similar = require("similar-strings");
const _merge = require("lodash/merge");
const mapCommands = require("./lib/mapCommands");
const getAliasedMap = require("./lib/getAliasedMap");
const parseInput = require("./lib/parseInput");
const matchArgs = require("./lib/matchArgs");

const optionsDefault = {
    caseSensitive: true,
    suggestSimilar: true
};

/**
 * Clingy class
 * @class
 */
module.exports = class Clingy {
    /**
     * Creates Clingy instance
     * @param {Object} commands
     */
    constructor(commands, options) {
        const _this = this;

        _this.options = _merge(optionsDefault, options);
        _this.map = mapCommands(commands, Clingy, _this.options);
        _this.mapAliased = getAliasedMap(_this.map);
        _this.keysAliased = Array.from(_this.mapAliased.keys());
    }
    /**
     * Returns all internal maps and keys
     * @returns {Object}
     */
    getAll() {
        const _this = this;

        return {
            map: _this.map,
            mapAliased: _this.mapAliased,
            keysAliased: _this.keysAliased
        };
    }
    /**
     * Recursiveley searches a command
     * @param {Array} commandPath
     * @param {Array} caller
     * @returns {Object}
     */
    getCommand(commandPath, caller = []) {
        const _this = this;
        const commandNameCurrent = _this.options.caseSensitive ? commandPath[0] : commandPath[0].toLowerCase();
        const callerNew = [...caller, commandNameCurrent]; //Add current name to caller chain

        if (_this.mapAliased.has(commandNameCurrent)) {
            const command = _this.mapAliased.get(commandNameCurrent);
            const commandPathNew = Array.from(commandPath).splice(1);

            if (commandPath.length > 1 && command.sub) { //If more paths need to be checked, recurse
                const commandSubResult = command.sub.getCommand(commandPathNew, callerNew);

                if (commandSubResult.success) {
                    return commandSubResult;
                }
            }

            return {
                success: true,
                command: command,
                commandPath: callerNew,
                commandPathRemains: commandPathNew
            };
        } else {
            /**
             * Throw if the command cant be found
             */
            const result = {
                success: false,
                error: {
                    type: "missingCommand",
                    missing: commandNameCurrent,
                },
                command: {
                    commandPath: callerNew
                }
            };

            if (_this.options.suggestSimilar) {
                result.error.similar = similar(commandNameCurrent, _this.keysAliased);
            }

            return result;
        }
    }
    /**
     * Parses a cli-input-string to command and args
     * @param {String} str
     * @returns {Object}
     */
    parse(str) {
        const _this = this;
        const arrParsed = parseInput(str);
        const commandLookup = _this.getCommand(arrParsed);
        const command = commandLookup.command;
        const args = commandLookup.commandPathRemains;

        if (commandLookup.success) {
            const argResult = matchArgs(command.args, args);

            if (argResult.missing.length > 0) { //returns error when not all args are present
                return {
                    success: false,
                    error: {
                        type: "missingArg",
                        missing: argResult.missing
                    }
                };
            } else {
                commandLookup.args = argResult.args; //Add args to result-object
            }
        }

        return commandLookup; //This is either the error OR the success result-object
    }
};
