"use strict";

const similar = require("similar-strings");
const mapCommandsToArray = require("./lib/mapCommandsToArray.js");
const aliasMap = require("./lib/aliasMap.js");

module.exports = class Clingy {
    constructor(commands) {
        const _this = this;

        _this.map = new Map(mapCommandsToArray(commands));
        _this.mapAliased = null;
        _this.keysAliased = null;

        _this.updateAliases();
    }
    updateAliases() {
        const _this = this;
        const aliasedMap = aliasMap(_this.map);

        _this.mapAliased = aliasedMap;
        _this.keysAliased = Array.from(aliasedMap.keys());
    }
    getAll() {
        const _this = this;

        return {
            map: _this.map,
            mapAliased: _this.mapAliased,
            keysAliased: _this.keysAliased
        };
    }
    getCommand(commandPath, caller = []) {
        const _this = this;
        const commandNameCurrent = commandPath[0]; //Current name to check
        const callerNew = [...caller, commandNameCurrent]; //Add current name to caller chain

        if (_this.keysAliased.includes(commandNameCurrent)) {
            const command = _this.mapAliased.get(commandNameCurrent);

            if (commandPath.length > 1) { //If more paths need to be checked, recurse
                const commandPathNew = Array.from(commandPath).splice(1);
                const commandSubResult = command.fn.getCommand(commandPathNew, callerNew);

                return commandSubResult;
            } else {
                return {
                    success: true,
                    command: command,
                    caller: callerNew
                };
            }
        } else {
            const similarKeys = similar(commandNameCurrent, _this.keysAliased);

            return {
                success: false,
                error: {
                    type: "missingCommand",
                    missing: commandNameCurrent,
                    similar: similarKeys
                }
            };
        }
    }
    /*parse(str) {
        const _this = this;
        const parsedInput = parseInput(str);
        const result = _this.getCommand(parsedInput.name);
        const command = result.command;

        if (result.success) {
            const argResult = matchArgs(command.args, parsedInput.args);

            if (argResult.missing.length > 0) { //returns error when not all args are present
                return {
                    success: false,
                    error: {
                        type: "missingArg",
                        missing: argResult.missing
                    }
                };
            } else {
                result.args = argResult.args;
            }
        }

        return result;
    }*/
};
