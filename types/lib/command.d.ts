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
 * Default command factory.
 *
 * @private
 * @param {number} index index to use for the default name.
 * @returns {object} command object.
 */
declare const commandDefaultFactory: (index: number) => IClingyCommand;
/**
 * Creates a map and sub-maps out of a command object.
 *
 * @private
 * @param {Array<IClingyCommand>} commandEntries entries of a command object.
 * @param {boolean} caseSensitive if commands should be case sensitive.
 * @returns {Map} command map.
 */
declare const mapCommands: (commandEntries: [string, IClingyCommand][], caseSensitive: boolean) => Map<string, IClingyCommand>;
export { IClingyCommandProcessed, IClingyCommands, IClingyCommand, mapCommands, clingyCommandEntry, clingyCommandEntries, commandDefaultFactory };
