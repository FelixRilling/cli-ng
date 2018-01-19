import { IClingyArg, IClingyArgLookup } from "../interfaces";

/**
 * Matches command-map arguments with input args
 *
 * @private
 * @param {Array<Object>} expectedArgs
 * @param {Array<Object>} givenArgs
 * @returns {Object}
 */
const mapArgs = (
    expectedArgs: IClingyArg[],
    givenArgs: string[]
): IClingyArgLookup => {
    const result: IClingyArgLookup = {
        args: {
            _all: givenArgs // Special arg that contains all other args
        },
        missing: []
    };

    expectedArgs.forEach((expectedArg: IClingyArg, index) => {
        const givenArg = givenArgs[index];

        if (givenArg) {
            // Arg exists
            result.args[expectedArg.name] = givenArg;
        } else {
            // Arg doesn't exist
            if (!expectedArg.required) {
                // Use default value
                result.args[expectedArg.name] = expectedArg.default;
            } else {
                // Mark as missing
                result.missing.push(expectedArg);
            }
        }
    });

    return result;
};

export default mapArgs;
