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
        map: Map<string, import("./lib/command").IClingyCommand>;
        mapAliased: Map<string, import("./lib/command").IClingyCommand>;
        /**
         * Returns all instance maps.
         *
         * @public
         * @returns {Object}
         */
        getAll(): {
            map: Map<string, import("./lib/command").IClingyCommand>;
            mapAliased: Map<string, import("./lib/command").IClingyCommand>;
        };
        /**
         * Looks up a command by path.
         *
         * @public
         * @param {Array<string>} path
         * @param {Array<string>} [pathUsed=[]]
         * @returns {Object}
         */
        getCommand(path: string[], pathUsed?: string[]): IClingyLookupSuccessful | IClingyLookupMissingCommand;
        /**
         * Parses a CLI-like input string into command and args.
         *
         * @public
         * @param {string} input
         * @returns {Object}
         */
        parse(input: string): IClingyLookupSuccessful | IClingyLookupMissingCommand | IClingyLookupMissingArg;
    };
};
export { Clingy, IClingy };
