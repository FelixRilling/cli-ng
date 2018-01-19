import { IClingyArg, IClingyArgLookup } from "../interfaces";
/**
 * Matches command-map arguments with input args
 *
 * @private
 * @param {Array<Object>} expectedArgs
 * @param {Array<Object>} givenArgs
 * @returns {Object}
 */
declare const mapArgs: (expectedArgs: IClingyArg[], givenArgs: string[]) => IClingyArgLookup;
export default mapArgs;
