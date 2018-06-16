import { IClingy } from "../clingy";
import { IClingyArg } from "./arg";
interface IClingyCommandProcessed extends IClingyCommand {
    name: string;
    sub: IClingy | null;
}
interface IClingyCommands {
    [key: string]: IClingyCommand;
}
interface IClingyCommand {
    [key: string]: any;
    fn: (...args: any[]) => any;
    alias: string[];
    args: IClingyArg[];
    sub: IClingyCommands | IClingy | null;
}
declare type clingyCommandEntry = [string, IClingyCommand];
declare type clingyCommandEntries = clingyCommandEntry[];
/**
 * Default command structure
 *
 * @private
 * @param {Object} arg
 * @param {number} index
 * @returns {Object}
 */
declare const commandDefaultFactory: (index: number) => IClingyCommand;
/**
 * Creates a map and sub-maps out of a command object.
 *
 * @private
 * @param {Array<IClingyCommand>} commandEntries
 * @returns {Map}
 */
declare const mapCommands: (commandEntries: [string, IClingyCommand][], caseSensitive: boolean) => Map<string, IClingyCommand>;
export { IClingyCommandProcessed, IClingyCommands, IClingyCommand, mapCommands, clingyCommandEntry, clingyCommandEntries, commandDefaultFactory };
