"use strict";

const similar = require("similar-strings");
const parseInput = require("./lib/parseInput");
const parseType = require("./lib/parseType");

module.exports = class {
    constructor(commands) {
        const _this = this;

        _this.$map = new Map();
        _this.$mapAliased = new Map();

        Object.keys(commands).forEach(key => {
            const value = commands[key];

            _this.$map.set(key, value);
            _this.$mapAliased.set(key, value);

            value.alias.forEach(alias => {
                _this.$mapAliased.set(alias, value);
            });
        });

        _this.$mapKeys = Array.from(_this.$map.keys());
        _this.$mapAliasedKeys = Array.from(_this.$mapAliased.keys());
    }
    parse(str) {
        const _this = this;
        const parsedInput = parseInput(str);
        const parsedInputName = parsedInput.name;
        const parsedInputArgs = parsedInput.args;
        let result;

        if (_this.$mapAliased.has(parsedInputName)) { //If the command exists
            const command = _this.$mapAliased.get(parsedInputName);
            const args = {};

            command.args.forEach((requestedArg, index) => { //Loop over expected args
                const suppliedArg = parsedInputArgs[index];


                if (suppliedArg) { //If arg exists
                    const parsedType = parseType(suppliedArg, requestedArg.type);

                    args[requestedArg.name] = parsedType;
                } else { //If arg doesnt exists
                    if (!requestedArg.required) {
                        //Insert default string
                        const parsedType = parseType(requestedArg.default, requestedArg.type);

                        args[requestedArg.name] = parsedType;
                    } else {
                        result = {
                            type: "error",
                            data: {
                                err: "missingArg",
                                missing: requestedArg
                            }
                        };
                    }
                }
            });

            if (!result) { //Return success if no error occured
                result = {
                    type: "success",
                    data: {
                        command: command,
                        args: args
                    }
                };
            }


            return result;
        } else {
            const similarCommands = similar(parsedInputName, _this.$mapAliasedKeys);

            return {
                type: "error",
                data: {
                    err: "missingCommand",
                    missing: parsedInputName,
                    similar: similarCommands
                }
            };
        }
    }
    help(commandName) {
        const _this = this;
        let result;

        if (!commandName) { //Return full list
            const list = Array.from(_this.$mapKeys).map(key => [key, _this.$map.get(key).help.short]);

            result = {
                type: "success",
                data: {
                    list: list
                }
            };
        } else { //Return detailed command help
            if (_this.$mapAliased.has(commandName)) { //If the command exists
                const command = _this.$mapAliased.get(commandName);

                result = {
                    type: "success",
                    data: {
                        command: command
                    }
                };
            } else {
                const similarCommands = similar(commandName, _this.$mapAliasedKeys);

                result = {
                    type: "error",
                    data: {
                        err: "missingCommand",
                        missing: commandName,
                        similar: similarCommands
                    }
                };
            }
        }

        return result;
    }
};
