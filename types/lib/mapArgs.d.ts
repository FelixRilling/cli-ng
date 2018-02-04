import { IClingyArg } from "../interfaces";
/**
 * Matches command-map arguments with input args
 *
 * @private
 * @param {Array<Object>} expectedArgs
 * @param {Array<Object>} givenArgs
 * @returns {Object}
 */
declare const mapArgs: (expectedArgs: IClingyArg[], givenArgs: string[]) => {
    args: {
        _all: string[];
    };
    missing: IClingyArg[];
};
export default mapArgs;
