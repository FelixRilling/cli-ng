import { IClingyLookupArgs } from "./lookup";

interface IClingyArgsMapped {
    args: IClingyLookupArgs;
    missing: IClingyArg[];
}

interface IClingyArg {
    [key: string]: any;
    name: string;
    required: boolean;
    default?: any;
}

/**
 * Default argument factory.
 *
 * @private
 * @param {number} index index to use for default name.
 * @returns {object} argument object.
 */
const argDefaultFactory = (index: number): IClingyArg => {
    return {
        name: `arg${index}`,
        required: true,
        default: null
    };
};

/**
 * Matches command-map arguments with input args.
 *
 * @private
 * @param {Array<object>} expectedArgs array of expected args.
 * @param {Array<object>} givenArgs array of given args.
 * @returns {object} mapArgs result object.
 */
const mapArgs = (
    expectedArgs: IClingyArg[],
    givenArgs: string[]
): IClingyArgsMapped => {
    const result: IClingyArgsMapped = {
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

export { mapArgs, IClingyArg, IClingyArgsMapped, argDefaultFactory };
