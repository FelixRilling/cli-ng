"use strict";

const parseType = require("./parseType");

module.exports = function (expectedArgs, givenArgs) {
    const result = {
        args: {},
        missing: []
    };

    expectedArgs.forEach((requestedArg, index) => { //Loop over expected args
        const suppliedArg = givenArgs[index];

        if (suppliedArg) { //If arg exists
            const parsedArg = parseType(suppliedArg, requestedArg.type);

            result.args[requestedArg.name] = parsedArg;
        } else { //If arg doesnt exists
            if (!requestedArg.required) {
                result.args[requestedArg.name] = requestedArg.default;
            } else {
                result.missing.push(requestedArg);
            }
        }
    });

    return result;
};
