"use strict";

const similar = require("similar-strings");
const mapCommandsToArray = require("./lib/mapCommandsToArray.js");

module.exports =  class Clingy{
    constructor(commands) {
        const _this = this;

        _this.map = new Map(mapCommandsToArray(commands));
        _this.mapAliased = null;
        _this.keysAliased = null;

        _this.updateAliases();
    }
    updateAliases() {
        const _this = this;
        const result = new Map(_this.map);

        result.forEach(val => {
            val.alias.forEach(alias => {
                result.set(alias, val);
            });
        });

        _this.mapAliased = result;
        _this.keysAliased = Array.from(result.keys());
    }
    deleteCommand(commandName) {
        const _this = this;

        _this.map.delete(commandName);
        _this.updateAliases();
    }
    setCommand(commands) {
        const _this = this;

        mapCommandsToArray(commands).forEach(command => {
            _this.map.set(command[0], command[1]);
        });

        _this.updateAliases();
    }
    getCommand(commandName) {
        const _this = this;

        /*if (_this.mapAliased.has(commandName)) {
            const command = _this.mapAliased.get(commandName);

            return {
                success: true,
                command: command,
                caller: commandName
            };
        } else {
            const similarKeys = similar(commandName, _this.keysAliased);

            return {
                success: false,
                error: {
                    type: "missingCommand",
                    missing: commandName,
                    similar: similarKeys
                }
            };
        }*/
    }
    getAll() {
        const _this = this;

        return {
            map: _this.map,
            mapAliased: _this.mapAliased,
            keysAliased: _this.keysAliased
        };
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
