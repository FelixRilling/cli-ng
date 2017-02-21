"use strict";

const getSimilarCommands = require("./getSimilarCommands");
const parseInput = require("./parseInput");
const parseType = require("./parseType");

module.exports = function (str, mapAliased, keysAliased) {
    const parsedInput = parseInput(str);
    const commandName = parsedInput.name;
    const commandArgs = parsedInput.args;

    if (mapAliased.has(commandName)) { //If the command exists
        const command = mapAliased.get(commandName);
        const args = {};
        const missingArgs = [];

        command.args.forEach((requestedArg, index) => { //Loop over expected args
            const suppliedArg = commandArgs[index];

            if (suppliedArg) { //If arg exists
                const parsedArg = parseType(suppliedArg, requestedArg.type);

                args[requestedArg.name] = parsedArg;
            } else { //If arg doesnt exists
                if (!requestedArg.required) {
                    //Insert default string
                    const parsedType = parseType(requestedArg.default, requestedArg.type);

                    args[requestedArg.name] = parsedType;
                } else {
                    missingArgs.push(requestedArg);
                }
            }
        });

        if (missingArgs.length) {
            return {
                type: "error",
                data: {
                    err: "missingArg",
                    missing: missingArgs
                }
            };
        }

        return {
            type: "success",
            data: {
                command: command,
                args: args,
                caller: commandName
            }
        };
    } else {
        return getSimilarCommands(commandName, keysAliased);
    }
};
