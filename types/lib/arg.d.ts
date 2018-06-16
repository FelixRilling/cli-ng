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
 * Default argument structure
 *
 * @private
 * @param {Object} arg
 * @param {number} index
 * @returns {Object}
 */
declare const argDefaultFactory: (index: number) => IClingyArg;
/**
 * Matches command-map arguments with input args
 *
 * @private
 * @param {Array<Object>} expectedArgs
 * @param {Array<Object>} givenArgs
 * @returns {Object}
 */
declare const mapArgs: (expectedArgs: IClingyArg[], givenArgs: string[]) => IClingyArgsMapped;
export { mapArgs, IClingyArg, IClingyArgsMapped, argDefaultFactory };
