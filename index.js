"use strict";

const similar = require("similar-strings");
const parseInput = require("./lib/parseInput");
const parseType = require("./lib/parseType");
const getAliasedMap = require("./lib/getAliasedMap");
const addCommandToMap = require("./lib/addCommandToMap");

module.exports = class {
    constructor(commands) {
        const _this = this;

        _this.map = new Map();

        Object.keys(commands).forEach(key => {
            _this.map = addCommandToMap(_this.map, key, commands[key]);
        });

        _this.mapAliased = getAliasedMap(_this.map);

        _this.keys = Array.from(_this.map.keys());
        _this.keysAliased = Array.from(_this.mapAliased.keys());
    }
    parse(str) {
        /*const _this = this;
        const parsedInput = parseInput(str);
        const parsedInputName = parsedInput.name;
        const parsedInputArgs = parsedInput.args;
        let result;

        if (_this.mapAliased.has(parsedInputName)) { //If the command exists
            const command = _this.mapAliased.get(parsedInputName);
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
                        args: args,
                        caller: parsedInputName
                    }
                };
            }

            return result;
        } else {
            const similarKeys = similar(parsedInputName, _this.keysAliased);
            const similarCommands = similarKeys.map(key => _this.mapAliased.get(key));

            return {
                type: "error",
                data: {
                    err: "missingCommand",
                    missing: parsedInputName,
                    similar: {
                        keys: similarKeys,
                        commands: similarCommands
                    }
                }
            };
        }*/
    }
    help(commandName) {
        /*const _this = this;
        let result;

        if (!commandName) { //Return full list
            const list = Array.from(_this.keys).map(key => [key, _this.map.get(key).help.short]);

            result = {
                type: "success",
                data: {
                    mode: "full",
                    list: list,
                    commands: _this.map
                }
            };
        } else { //Return detailed command help
            if (_this.mapAliased.has(commandName)) { //If the command exists
                const command = _this.mapAliased.get(commandName);

                result = {
                    type: "success",
                    data: {
                        mode: "detail",
                        command: {
                            command: command,
                            key: commandName
                        }
                    }
                };
            } else {
                const similarKeys = similar(commandName, _this.keysAliased);
                const similarCommands = similarKeys.map(key => _this.mapAliased.get(key));

                result = {
                    type: "error",
                    data: {
                        err: "missingCommand",
                        missing: commandName,
                        similar: {
                            keys: similarKeys,
                            commands: similarCommands
                        }
                    }
                };
            }
        }

        return result;*/
    }
    get(key) {
        return this.mapAliased.get(key);
    }
    set(key, command) {
        const _this = this;

        _this.map = addCommandToMap(_this.map, key, command);

        _this.mapAliased = getAliasedMap(_this.map);

        _this.keys = Array.from(_this.map.keys());
        _this.keysAliased = Array.from(_this.mapAliased.keys());
    }
};
