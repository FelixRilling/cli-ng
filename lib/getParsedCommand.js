"use strict";

const parseInput = require("./parseInput");
const parseType = require("./parseType");
const getCommand = require("./getCommand");

module.exports = function (str, mapAliased, keysAliased) {
    const parsedInput = parseInput(str);
    const result = getCommand(parsedInput.name, mapAliased, keysAliased);
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
                    //Insert default string
                    const parsedType = parseType(requestedArg.default, requestedArg.type);

                    args[requestedArg.name] = parsedType;
                } else {
                    missingArgs.push(requestedArg);
                }
            }
        });

        if (missingArgs.length > 0) {//returns error when not all args are present
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
};
