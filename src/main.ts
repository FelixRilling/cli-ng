"use strict";

import {
    arrFrom,
    isString,
    objDefaults,
    objDefaultsDeep,
    objEntries
} from "lightdash";
import similar from "similar-strings";
import {
    IClingy,
    IClingyArg,
    IClingyCommand,
    IClingyCommandProcessed,
    IClingyCommands,
    IClingyLookupMissingArg,
    IClingyLookupMissingCommand,
    IClingyLookupSuccessful,
    IClingyOptions
} from "./interfaces";
import argDefaultFactory from "./lib/argDefaultFactory";
import commandDefaultFactory from "./lib/commandDefaultFactory";
import getAliasedMap from "./lib/getAliasedMap";
import mapArgs from "./lib/mapArgs";
import parseString from "./lib/parseString";
import {
    clingyCommandEntries,
    clingyCommandEntry,
    clingyCommandMap
} from "./types";

const optionsDefault: IClingyOptions = {
    /**
     * If names should be treated case-sensitive for lookup
     */
    caseSensitive: true,
    /**
     * List of characters to allow as quote-enclosing string
     * If set to null, quotes-enclosed strings will be disabled
     */
    validQuotes: ['"']
};

/**
 * Creates a map and sub-maps out of a command object
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
        commandEntries.map((command, index): clingyCommandEntry => {
            if (!isString(command[0])) {
                throw new TypeError(
                    `command key '${command[0]}' is not a string`
                );
            }

            const commandKey = caseSensitive
                ? command[0]
                : command[0].toLowerCase();
            const commandValue = <IClingyCommand>objDefaultsDeep(
                command[1],
                commandDefaultFactory(index)
            );

            // Save key as name property to keep track in aliases
            commandValue.name = commandKey;
            // Merge each arg with default arg structure
            commandValue.args = commandValue.args.map(
                (arg, argIndex) =>
                    <IClingyArg>objDefaults(arg, argDefaultFactory(argIndex))
            );

            // If sub-groups exist, recurse by creating a new Clingy instance
            if (commandValue.sub !== null) {
                (<IClingyCommandProcessed>commandValue).sub = new Clingy(
                    commandValue.sub
                );
            }

            return [commandKey, commandValue];
        })
    );

/**
 * Clingy class
 *
 * @class
 */
const Clingy = class implements IClingy {
    public options: IClingyOptions;
    public map: clingyCommandMap;
    public mapAliased: clingyCommandMap;
    /**
     * Creates Clingy instance
     *
     * @constructor
     * @param {Object} commands
     * @param {Object} options
     */
    constructor(commands: any = {}, options: any = {}) {
        this.options = <IClingyOptions>objDefaultsDeep(options, optionsDefault);
        this.map = mapCommands(
            objEntries(commands),
            this.options.caseSensitive
        );
        this.mapAliased = getAliasedMap(this.map);
    }
    /**
     * Returns all instance maps
     *
     * @returns {Object}
     */
    public getAll() {
        return {
            map: this.map,
            mapAliased: this.mapAliased
        };
    }
    /**
     * Looks up a command by path
     *
     * @param {Array<string>} path
     * @param {Array<string>} [pathUsed=[]]
     * @returns {Object}
     */
    public getCommand(
        path: string[],
        pathUsed: string[] = []
    ): IClingyLookupSuccessful | IClingyLookupMissingCommand {
        if (path.length < 1) {
            throw new Error("Path does not contain at least one item");
        }
        const commandNameCurrent = this.options.caseSensitive
            ? path[0]
            : path[0].toLowerCase();
        const pathUsedNew = pathUsed;

        if (!this.mapAliased.has(commandNameCurrent)) {
            return <IClingyLookupMissingCommand>{
                success: false,
                error: {
                    type: "missingCommand",
                    missing: [commandNameCurrent],
                    similar: similar(
                        commandNameCurrent,
                        arrFrom(this.mapAliased.keys())
                    )
                },
                path: pathUsedNew
            };
        }
        const command = <IClingyCommandProcessed>this.mapAliased.get(
            commandNameCurrent
        );
        const commandPathNew = path.slice(1);

        pathUsedNew.push(commandNameCurrent);

        // Recurse into sub if more items in path and sub exists
        if (path.length > 1 && command.sub !== null) {
            const commandSubResult = command.sub.getCommand(
                commandPathNew,
                pathUsedNew
            );

            if (commandSubResult.success) {
                return commandSubResult;
            }
        }

        return {
            success: true,
            command,
            path: pathUsedNew,
            pathDangling: commandPathNew
        };
    }
    /**
     * Parses a CLI-like input string into command and args
     *
     * @param {string} input
     * @returns {Object}
     */
    public parse(
        input: string
    ):
        | IClingyLookupSuccessful
        | IClingyLookupMissingCommand
        | IClingyLookupMissingArg {
        const inputParsed = parseString(input, this.options.validQuotes);
        const commandLookup = this.getCommand(inputParsed);

        if (!commandLookup.success) {
            // Error: Command not found
            return commandLookup;
        }

        const command = commandLookup.command;
        const args = commandLookup.pathDangling;
        const argsMapped = mapArgs(command.args, args);

        if (argsMapped.missing.length !== 0) {
            // Error: Missing arguments
            return <IClingyLookupMissingArg>{
                success: false,
                error: {
                    type: "missingArg",
                    missing: argsMapped.missing
                }
            };
        }

        commandLookup.args = argsMapped.args;

        // Success
        return commandLookup;
    }
};

export default Clingy;
