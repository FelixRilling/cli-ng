"use strict";

const similar = require("similar-strings");

const getAliasedMap = require("./lib/getAliasedMap");
const addCommandToMap = require("./lib/addCommandToMap");
const parseInput = require("./lib/parseInput");
const parseType = require("./lib/parseType");

module.exports = class {
    constructor(commands) {
        const _this = this;

        _this.map = new Map();

        Object.keys(commands).forEach(key => {
            _this.map = addCommandToMap(_this.map, key, commands[key]);
        });
        _this.updateAliased();
    }
    updateAliased() {
        const _this = this;

        _this.mapAliased = getAliasedMap(_this.map);
        _this.keysAliased = Array.from(_this.mapAliased.keys());
    }
    set(commandName, command) {
        const _this = this;

        _this.map = addCommandToMap(_this.map, commandName, command);
        _this.updateAliased();
    }
    get(commandName) {
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
                keys: _this.keys
            }
        };
    }
    parse(str) {
        const _this = this;
        const parsedInput = parseInput(str);
        const result = _this.get(parsedInput.name);
        const command = result.data.command;

        if (result.type === "success") {
            const args = {};
            const missingArgs = [];

            command.args.forEach((requestedArg, index) => { //Loop over expected args
                const suppliedArg = parsedInput.args[index];

                if (suppliedArg) { //If arg exists
                    const parsedArg = parseType(suppliedArg, requestedArg.type);

                    args[requestedArg.name] = parsedArg;
                } else { //If arg doesnt exists
                    if (!requestedArg.required) {
                        args[requestedArg.name] = requestedArg.default;
                    } else {
                        missingArgs.push(requestedArg);
                    }
                }
            });

            if (missingArgs.length > 0) { //returns error when not all args are present
                return {
                    type: "error",
                    data: {
                        err: "missingArg",
                        missing: missingArgs
                    }
                };
            } else {
                result.data.args = args;
            }
        }

        console.log(result);

        return result;
    }
};
