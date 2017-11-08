"use strict";

/**
 * Matches command-map arguments with input args
 *
 * @private
 * @param {Array<Object>} expectedArgs
 * @param {Array<Object>} givenArgs
 * @returns {Object}
 */
module.exports = (expectedArgs, givenArgs) => {
    const result = {
        args: {
            _all: givenArgs //special arg that contains all other args
        },
        missing: []
    };

    expectedArgs.forEach((expectedArg, index) => {
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
