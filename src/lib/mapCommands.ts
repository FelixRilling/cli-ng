import { isString, objDefaults, objDefaultsDeep } from "lightdash";
import { Clingy } from "../clingy";
import {
    IClingyArg,
    IClingyCommand,
    IClingyCommandProcessed
} from "../interfaces";
import {
    clingyCommandEntries,
    clingyCommandEntry,
    clingyCommandMap
} from "../types";
import { argDefaultFactory } from "./argDefaultFactory";
import { commandDefaultFactory } from "./commandDefaultFactory";

/**
 * Creates a map and sub-maps out of a command object.
 *
 * @private
 * @param {Array<IClingyCommand>} commandEntries
 * @returns {Map}
 */
const mapCommands = (
    commandEntries: clingyCommandEntries,
    caseSensitive: boolean
): clingyCommandMap =>
    new Map(
        commandEntries.map(
            (command, index): clingyCommandEntry => {
                if (!isString(command[0])) {
                    throw new TypeError(
                        `command key '${command[0]}' is not a string`
                    );
                }

                const commandKey = caseSensitive
                    ? command[0]
                    : command[0].toLowerCase();
                const commandValue = <IClingyCommand>(
                    objDefaultsDeep(command[1], commandDefaultFactory(index))
                );

                // Save key as name property to keep track in aliases
                commandValue.name = commandKey;
                // Merge each arg with default arg structure
                commandValue.args = commandValue.args.map(
                    (arg, argIndex) =>
                        <IClingyArg>(
                            objDefaults(arg, argDefaultFactory(argIndex))
                        )
                );

                // If sub-groups exist, recurse by creating a new Clingy instance
                if (commandValue.sub !== null) {
                    (<IClingyCommandProcessed>commandValue).sub = new Clingy(
                        commandValue.sub
                    );
                }

                return [commandKey, commandValue];
            }
        )
    );

export { mapCommands };
