"use strict";

/**
 * Matches command-map arguments with input args
 * @private
 * @param {Array} expectedArgs
 * @param {Array} givenArgs
 * @returns {Object}
 */
module.exports = function (expectedArgs, givenArgs) {
    const result = {
        args: {
            _all: givenArgs //special arg that contains all other args
        },
        missing: []
    };

    expectedArgs.forEach((expectedArg, index) => { //Loop over expected args
        const givenArg = givenArgs[index];

        if (givenArg) {
            //Arg exists
            result.args[expectedArg.name] = givenArg;
        } else {
            //Arg doesnt exist
            if (!expectedArg.required) {
                //Use default value
                result.args[expectedArg.name] = expectedArg.default;
            } else {
                //Mark as missing
                result.missing.push(expectedArg);
            }
        }
    });

    return result;
};