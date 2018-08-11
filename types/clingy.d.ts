import { IClingyLookupMissingArg, IClingyLookupMissingCommand, IClingyLookupSuccessful } from "./lib/lookup";
import { clingyCommandMap } from "./lib/map";
import { IClingyOptions } from "./lib/options";
interface IClingy {
    options: IClingyOptions;
    map: clingyCommandMap;
    mapAliased: clingyCommandMap;
    getAll(): {
        map: clingyCommandMap;
        mapAliased: clingyCommandMap;
    };
    getCommand(path: string[], pathUsed?: string[]): IClingyLookupSuccessful | IClingyLookupMissingCommand;
    parse(input: string): IClingyLookupSuccessful | IClingyLookupMissingCommand | IClingyLookupMissingArg;
}
/**
 * Clingy class.
 *
 * @public
 * @class
 */
declare const Clingy: {
    new (commands: object, options?: object): {
        options: IClingyOptions;
        map: Map<string, import("src/_old/lib/command").IClingyCommand>;
        mapAliased: Map<string, import("src/_old/lib/command").IClingyCommand>;
        /**
         * Returns all instance maps.
         *
         * @public
         * @returns {object} object of the internal maps.
         */
        getAll(): {
            map: Map<string, import("src/_old/lib/command").IClingyCommand>;
            mapAliased: Map<string, import("src/_old/lib/command").IClingyCommand>;
        };
        /**
         * Looks up a command by path.
         *
         * @public
         * @param {Array<string>} path command path to look up.
         * @param {Array<string>} [pathUsed=[]] when called from itself, the path already taken.
         * @returns {object}
         */
        getCommand(path: string[], pathUsed?: string[]): IClingyLookupSuccessful | IClingyLookupMissingCommand;
        /**
         * Parses a CLI-like input string into command and args.
         *
         * @public
         * @param {string} input input string to parse.
         * @returns {object} result object.
         */
        parse(input: string): IClingyLookupSuccessful | IClingyLookupMissingCommand | IClingyLookupMissingArg;
    };
};
export { Clingy, IClingy };
