import { IClingyCommand } from "../interfaces";
/**
 * Creates a map and sub-maps out of a command object.
 *
 * @private
 * @param {Array<IClingyCommand>} commandEntries
 * @returns {Map}
 */
declare const mapCommands: (commandEntries: [string, IClingyCommand][], caseSensitive: boolean) => Map<string, IClingyCommand>;
export { mapCommands };
