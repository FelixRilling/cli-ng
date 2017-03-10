"use strict";

const parseType = require("./parseType");

module.exports = function (expectedArgs, givenArgs) {
    const onMissingArg = function (expectedArg) {
        if (!expectedArg.required) {
            result.args[expectedArg.name] = expectedArg.default;
        } else {
            result.missing.push(expectedArg);
        }
    };
    const result = {
        args: {},
        missing: []
    };

    expectedArgs.forEach((expectedArg, index) => { //Loop over expected args
        const givenArg = givenArgs[index];

        if (givenArg) { //If arg exists
            const parsedArg = parseType(givenArg, expectedArg.type);

            if (parsedArg !== null) {
                result.args[expectedArg.name] = parsedArg;
            } else {
                onMissingArg(expectedArg);
            }
        } else { //If arg doesnt exists
            onMissingArg(expectedArg);
        }
    });

    return result;
};

