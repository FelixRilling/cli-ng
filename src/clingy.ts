import { objDefaultsDeep, strSimilar } from "lightdash";
import { mapArgs } from "./lib/arg";
import { IClingyCommandProcessed, mapCommands } from "./lib/command";
import {
    IClingyLookupMissingArg,
    IClingyLookupMissingCommand,
    IClingyLookupSuccessful
} from "./lib/lookup";
import { clingyCommandMap, getAliasedMap } from "./lib/map";
import { IClingyOptions, optionsDefault } from "./lib/options";
import { parseString } from "./lib/parseString";

interface IClingy {
    options: IClingyOptions;
    map: clingyCommandMap;
    mapAliased: clingyCommandMap;
    getAll(): {
        map: clingyCommandMap;
        mapAliased: clingyCommandMap;
    };
    getCommand(
        path: string[],
        pathUsed?: string[]
    ): IClingyLookupSuccessful | IClingyLookupMissingCommand;
    parse(
        input: string
    ):
        | IClingyLookupSuccessful
        | IClingyLookupMissingCommand
        | IClingyLookupMissingArg;
}

/**
 * Clingy class.
 *
 * @public
 * @class
 */
const Clingy = class implements IClingy {
    public options: IClingyOptions;
    public map: clingyCommandMap;
    public mapAliased: clingyCommandMap;
    /**
     * Creates Clingy instance.
     *
     * @public
     * @constructor
     * @param {Object} commands
     * @param {Object} [options={}]
     */
    constructor(commands: object, options: object = {}) {
        this.options = <IClingyOptions>objDefaultsDeep(options, optionsDefault);
        this.map = mapCommands(
            Object.entries(commands),
            this.options.caseSensitive
        );
        this.mapAliased = getAliasedMap(this.map);
    }
    /**
     * Returns all instance maps.
     *
     * @public
     * @returns {Object}
     */
    public getAll() {
        return {
            map: this.map,
            mapAliased: this.mapAliased
        };
    }
    /**
     * Looks up a command by path.
     *
     * @public
     * @param {Array<string>} path
     * @param {Array<string>} [pathUsed=[]]
     * @returns {Object}
     */
    public getCommand(
        path: string[],
        pathUsed: string[] = []
    ): IClingyLookupSuccessful | IClingyLookupMissingCommand {
        if (path.length < 1) {
            throw new TypeError("Path does not contain at least one item");
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
                    similar: strSimilar(
                        commandNameCurrent,
                        Array.from(this.mapAliased.keys())
                    )
                },
                path: pathUsedNew
            };
        }

        const command = <IClingyCommandProcessed>(
            this.mapAliased.get(commandNameCurrent)
        );
        const commandPathNew = path.slice(1);

        pathUsedNew.push(commandNameCurrent);

        // Recursively go into sub if more items in path and sub exists
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
     * Parses a CLI-like input string into command and args.
     *
     * @public
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
            return commandLookup; // Error: Command not found
        }

        const command = commandLookup.command;
        const args = commandLookup.pathDangling;
        const argsMapped = mapArgs(command.args, args);

        if (argsMapped.missing.length !== 0) {
            return <IClingyLookupMissingArg>{
                success: false,
                error: {
                    type: "missingArg",
                    missing: argsMapped.missing
                }
            }; // Error: Missing arguments
        }

        commandLookup.args = argsMapped.args;

        return commandLookup; // Success
    }
};

export { Clingy, IClingy };
