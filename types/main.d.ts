import { IClingyCommand, IClingyCommands, IClingyOptions, IClingyOptionsDefaulted, IClingyLookupSuccessful, IClingyLookupUnsuccessful } from "./interfaces";
/**
 * Clingy class
 *
 * @class
 */
declare const Clingy: {
    new (commands: IClingyCommands, options?: IClingyOptions): {
        options: IClingyOptionsDefaulted;
        map: Map<string, IClingyCommand>;
        mapAliased: Map<string, IClingyCommand>;
        getAll(): {
            map: Map<string, IClingyCommand>;
            mapAliased: Map<string, IClingyCommand>;
        };
        getCommand(path: string[], pathUsed?: string[]): IClingyLookupSuccessful | IClingyLookupUnsuccessful;
    };
};
export default Clingy;
