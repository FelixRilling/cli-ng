"use strict";

import similar from "similar-strings";
import {
    objDefaults,
    objDefaultsDeep,
    isString,
    objEntries,
    arrFrom
} from "lightdash";
import getAliasedMap from "./lib/getAliasedMap";
import mapArgs from "./lib/mapArgs";
import parseString from "./lib/parseString";
import argDefaultFactory from "./lib/argDefaultFactory";
import commandDefaultFactory from "./lib/commandDefaultFactory";
import {
    IClingy,
    IClingyArg,
    IClingyCommand,
    IClingyCommandProcessed,
    IClingyCommands,
    IClingyOptions,
    IClingyLookupSuccessful,
    IClingyLookupMissingCommand,
    IClingyLookupMissingArg
} from "./interfaces";
import {
    clingyCommandEntry,
    clingyCommandEntries,
    clingyCommandMap
} from "./types";

/**
 * Default option structure
 */
const optionsDefault: IClingyOptions = {
    /**
     * If names should be treated case-sensitive for lookup
     */
    caseSensitive: true,
    /**
     * List of characters to allow as quote-enclosing string
     * If set to null, quotes-enclosed strings will be disabled
     */
    validQuotes: ["\""]
};

/**
 * Creates a map and submaps out of a command object
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
                (arg, index) =>
                    <IClingyArg>objDefaults(arg, argDefaultFactory(index))
            );

            //If sub-groups exist, recurse by creating a new Clingy instance
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
     * @param {Object} commands Command object
     * @param {Object} options Option object
     */
    constructor(commands: any, options: any = {}) {
        this.options = <IClingyOptions>objDefaultsDeep(
            options,
            optionsDefault
        );
        this.map = mapCommands(
            objEntries(commands),
            this.options.caseSensitive
        );
        this.mapAliased = getAliasedMap(this.map);
    }
    /**
     * Returns internal maps
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
     * Recursiveley searches a command
     *
     * @param {Array<string>} path Array of strings indicating the path to get
     * @param {Array<string>} [pathUsed=[]] Array of strings indicating the path that was taken so far
     * @returns {Object}
     */
    public getCommand(
        path: string[],
        pathUsed: string[] = []
    ): IClingyLookupSuccessful | IClingyLookupMissingCommand {
        const pathUsedNew = pathUsed;
        const commandNameCurrent = this.options.caseSensitive
            ? path[0]
            : path[0].toLowerCase();

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
            command: command,
            path: pathUsedNew,
            pathDangling: commandPathNew
        };
    }
    /**
     * Parses a cli-input-string to command and args
     *
     * @param {string} input
     * @returns {Object}
     */
    public parse(
        input: string
    ): IClingyLookupSuccessful | IClingyLookupMissingCommand | IClingyLookupMissingArg {
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
