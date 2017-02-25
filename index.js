"use strict";

const similar = require("similar-strings");

const getAliasedMap = require("./lib/getAliasedMap");
const parseCommand = require("./lib/parseCommand");
const parseInput = require("./lib/parseInput");
const matchArgs = require("./lib/matchArgs");

module.exports = class {
    constructor(commands) {
        const _this = this;

        _this.map = new Map();

        Object.keys(commands).forEach(key => {
            const command = parseCommand(key, commands[key]);

            _this.map.set(key, command);
        });
        _this.updateAliased();
    }
    updateAliased() {
        const _this = this;

        _this.mapAliased = getAliasedMap(_this.map);
        _this.keysAliased = Array.from(_this.mapAliased.keys());
    }
    setCommand(commandName, commandContent) {
        const _this = this;
        const command = parseCommand(commandName, commandContent);

        _this.map.set(commandName, command);
        _this.updateAliased();
    }
    getCommand(commandName) {
        const _this = this;

        if (_this.mapAliased.has(commandName)) {
            const command = _this.mapAliased.get(commandName);

            return {
                type: "success",
                data: {
                    command: command,
                    caller: commandName
                }
            };
        } else {
            const similarKeys = similar(commandName, _this.keysAliased);

            return {
                type: "error",
                data: {
                    err: "missingCommand",
                    missing: commandName,
                    similar: similarKeys
                }
            };
        }
    }
    getAll() {
        const _this = this;

        return {
            type: "success",
            data: {
                map: _this.map,
                mapAliased: _this.mapAliased,
                keys: _this.keysAliased
            }
        };
    }
    parse(str) {
        const _this = this;
        const parsedInput = parseInput(str);
        const result = _this.getCommand(parsedInput.name);
        const command = result.data.command;

        if (result.type === "success") {
            const argResult = matchArgs(command.args, parsedInput.args);

            if (argResult.missing.length > 0) { //returns error when not all args are present
                return {
                    type: "error",
                    data: {
                        err: "missingArg",
                        missing: argResult.missing
                    }
                };
            } else {
                result.data.args = argResult.args;
            }
        }

        return result;
    }
};
