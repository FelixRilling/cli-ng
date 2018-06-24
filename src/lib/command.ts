import { isString, objDefaults, objDefaultsDeep } from "lightdash";
import { Clingy, IClingy } from "../clingy";
import { IClingyArg } from "./arg";
import { argDefaultFactory } from "./arg";
import { clingyCommandMap } from "./map";

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

type clingyCommandEntry = [string, IClingyCommand];

type clingyCommandEntries = clingyCommandEntry[];

/**
 * Default command factory.
 *
 * @private
 * @param {number} index index to use for the default name.
 * @returns {object} command object.
 */
const commandDefaultFactory = (index: number): IClingyCommand => {
    return {
        name: `command${index}`,
        fn: () => {},
        alias: [],
        args: [],
        sub: null
    };
};

/**
 * Creates a map and sub-maps out of a command object.
 *
 * @private
 * @param {Array<IClingyCommand>} commandEntries entries of a command object.
 * @param {boolean} caseSensitive if commands should be case sensitive.
 * @returns {Map} command map.
 */
const mapCommands = (
    commandEntries: clingyCommandEntries,
    caseSensitive: boolean
): clingyCommandMap =>
    new Map(
        commandEntries.map(
            (command, index): clingyCommandEntry => {
                if (!isString(command[0])) {
                    throw new Error(
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

export {
    IClingyCommandProcessed,
    IClingyCommands,
    IClingyCommand,
    mapCommands,
    clingyCommandEntry,
    clingyCommandEntries,
    commandDefaultFactory
};
