"use strict";

const similar = require("similar-strings");
const getAliasedMap = require("./lib/getAliasedMap");
const parseInput = require("./lib/parseInput");
const matchArgs = require("./lib/matchArgs");

/**
 * Cli-ngy class
 * @class
 */
module.exports = class Clingy {
    /**
     * Creates Cli-ngy instance
     * @param {Object} commands
     */
    constructor(commands) {
        const _this = this;
        const entries = Object.entries(commands).map(command => {
            const commandKey = command[0];
            const commandValue = command[1];
            const result = Object.assign({}, commandValue);

            result.name = commandKey;

            if (result.sub) {
                result.sub = new Clingy(result.sub); //Create a sub-instance for subgroups
            }

            return [commandKey, result];
        });

        _this.map = new Map(entries);
        _this.mapAliased = getAliasedMap(_this.map);
        _this.keysAliased = Array.from(_this.mapAliased.keys());
    }
    /**
     * Returns all internal maps
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
        const commandNameCurrent = commandPath[0]; //Current name to check
        const callerNew = [...caller, commandNameCurrent]; //Add current name to caller chain

        if (_this.keysAliased.includes(commandNameCurrent)) {
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
            const similarKeys = similar(commandNameCurrent, _this.keysAliased);

            return {
                success: false,
                error: {
                    type: "missingCommand",
                    missing: commandNameCurrent,
                    similar: similarKeys,
                },
                command: {
                    commandPath: callerNew
                }
            };
        }
    }
    /**
     * Parses a cli-input string to command/args
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
