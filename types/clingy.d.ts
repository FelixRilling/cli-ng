import { IClingyLookupMissingArg, IClingyLookupMissingCommand, IClingyLookupSuccessful, IClingyOptions } from "./interfaces";
/**
 * Clingy class.
 *
 * @public
 * @class
 */
declare const Clingy: {
    new (commands: object, options?: object): {
        options: IClingyOptions;
        map: Map<string, import("./interfaces").IClingyCommand>;
        mapAliased: Map<string, import("./interfaces").IClingyCommand>;
        /**
         * Returns all instance maps.
         *
         * @public
         * @returns {Object}
         */
        getAll(): {
            map: Map<string, import("./interfaces").IClingyCommand>;
            mapAliased: Map<string, import("./interfaces").IClingyCommand>;
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
export { Clingy };
