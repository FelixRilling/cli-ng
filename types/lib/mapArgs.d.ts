import { IClingyArg, IClingyArgsMapped } from "../interfaces";
/**
 * Matches command-map arguments with input args
 *
 * @private
 * @param {Array<Object>} expectedArgs
 * @param {Array<Object>} givenArgs
 * @returns {Object}
 */
declare const mapArgs: (expectedArgs: IClingyArg[], givenArgs: string[]) => IClingyArgsMapped;
export { mapArgs };
