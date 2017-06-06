"use strict";

const similar = require("similar-strings");

const mapOptions = require("./lib/mapOptions");
const mapCommands = require("./lib/mapCommands");
const mapArgs = require("./lib/mapArgs");
const getAliasedMap = require("./lib/getAliasedMap");
const parseInput = require("./lib/parseInput");

/**
 * Clingy class
 * @class
 */
module.exports = class Clingy {
    /**
     * Creates Clingy instance
     * @param {Object} commands Command object
     * @param {Object} options Option object
     */
    constructor(commands, options) {
        this.options = mapOptions(options);
        this.map = mapCommands(commands, Clingy, this.options);
        this.mapAliased = getAliasedMap(this.map);
        this.keysAliased = Array.from(this.mapAliased.keys());
    }
    /**
     * Returns all internal maps and keys
     * @returns {Object}
     */
    getAll() {
        return {
            map: this.map,
            mapAliased: this.mapAliased,
            keysAliased: this.keysAliased
        };
    }
    /**
     * Recursiveley searches a command
     * @param {Array} commandPath Array of strings indicating the path to get
     * @param {Array=} commandPathUsed Array of strings indicating the path that was taken so far
     * @returns {Object}
     */
    getCommand(commandPath, commandPathUsed = []) {
        const commandPathUsedNew = commandPathUsed;
        const commandNameCurrent = this.options.lookup.namesAreCaseSensitive ? commandPath[0] : commandPath[0].toLowerCase();

        /**
         * Flow:
         *   Exists in current layer?
         *      true-> Has more path entries and contains sub-groups?
         *          true-> Is sub-group getCommand successful?
         *              true-> Return sub-group result
         *              false-> Return current result
         *          false-> Return current result
         *      false-> Return Error
         */
        if (this.mapAliased.has(commandNameCurrent)) {
            const command = this.mapAliased.get(commandNameCurrent);
            const commandPathNew = commandPath.slice(1);

            //Add to used path
            commandPathUsedNew.push(commandNameCurrent);

            //Recurse into sub if requested
            if (commandPath.length > 1 && command.sub !== null) { //If more paths need to be checked, recurse
                const commandSubResult = command.sub.getCommand(commandPathNew, commandPathUsedNew);

                if (commandSubResult.success) {
                    return commandSubResult;
                }
            }

            return {
                success: true,
                command: command,
                path: commandPathUsedNew,
                pathDangling: commandPathNew
            };
        } else {
            return {
                success: false,
                error: {
                    type: "missingCommand",
                    missing: commandNameCurrent,
                    similar: similar(commandNameCurrent, this.keysAliased)
                },
                path: commandPathUsedNew
            };
        }
    }
    /**
     * Parses a cli-input-string to command and args
     * @param {String} input
     * @returns {Object}
     */
    parse(input) {
        const inputParsed = parseInput(input);
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
                //Add args to result-object
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
