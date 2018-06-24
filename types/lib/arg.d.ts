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
declare const argDefaultFactory: (index: number) => IClingyArg;
/**
 * Matches command-map arguments with input args.
 *
 * @private
 * @param {Array<object>} expectedArgs array of expected args.
 * @param {Array<object>} givenArgs array of given args.
 * @returns {object} mapArgs result object.
 */
declare const mapArgs: (expectedArgs: IClingyArg[], givenArgs: string[]) => IClingyArgsMapped;
export { mapArgs, IClingyArg, IClingyArgsMapped, argDefaultFactory };
