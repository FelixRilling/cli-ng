"use strict";

const parseType = require("./parseType");

/**
 * Matches command-map arguments with input args
 * @private
 * @param {Array} expectedArgs
 * @param {Array} givenArgs
 * @returns {Object}
 */
module.exports = function (expectedArgs, givenArgs) {
    const result = {
        args: {},
        missing: []
    };
    const onMissingArg = function (expectedArg) {
        if (!expectedArg.required) {
            result.args[expectedArg.name] = expectedArg.default;
        } else {
            result.missing.push(expectedArg);
        }
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
