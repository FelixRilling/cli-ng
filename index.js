"use strict";

const similar = require("similar-strings");
const getAliasedMap = require("./lib/getAliasedMap");
const mapCommandsToArray = require("./lib/mapCommandsToArray");
const parseInput = require("./lib/parseInput");
const matchArgs = require("./lib/matchArgs");

module.exports = class {
    constructor(commandObj) {
        const _this = this;
        const commandsArr = mapCommandsToArray(commandObj);

        _this.map = new Map(commandsArr);
        _this.updateAliasedMap();
    }
    updateAliasedMap() {
        const _this = this;

        _this.mapAliased = getAliasedMap(_this.map);
        _this.keysAliased = Array.from(_this.mapAliased.keys());
    }
    deleteCommand(commandName) {
        const _this = this;

        _this.map.delete(commandName);
        _this.updateAliasedMap();
    }
    setCommand(commandObj) {
        const _this = this;
        const commandsArr = mapCommandsToArray(commandObj);

        commandsArr.forEach(command => {
            _this.map.set(...command);
        });

        _this.updateAliasedMap();
    }
    getCommand(commandName) {
        const _this = this;

        if (_this.mapAliased.has(commandName)) {
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
                errorr: {
                    type: "missingCommand",
                    missing: commandName,
                    similar: similarKeys
                }
            };
        }
    }
    getAll() {
        const _this = this;

        return {
            map: _this.map,
            mapAliased: _this.mapAliased,
            keys: _this.keysAliased
        };
    }
    parse(str) {
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
    }
};
