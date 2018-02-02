import similar from 'similar-strings';
import { objDefaults, objDefaultsDeep, isString, objEntries, arrFrom } from 'lightdash';

/**
 * Creates an aliased map from a normal map
 *
 * @private
 * @param {Map} map
 * @returns {Map}
 */
const getAliasedMap = (map) => {
    const result = new Map(map);
    map.forEach((command) => {
        command.alias.forEach((alias) => {
            if (result.has(alias)) {
                throw new Error(`Alias ${alias} conflicts with a previously defined key`);
            }
            else {
                result.set(alias, command);
            }
        });
    });
    return result;
};

/**
 * Matches command-map arguments with input args
 *
 * @private
 * @param {Array<Object>} expectedArgs
 * @param {Array<Object>} givenArgs
 * @returns {Object}
 */
const mapArgs = (expectedArgs, givenArgs) => {
    const result = {
        args: {
            _all: givenArgs // Special arg that contains all other args
        },
        missing: []
    };
    expectedArgs.forEach((expectedArg, index) => {
        const givenArg = givenArgs[index];
        if (givenArg) {
            // Arg exists
            result.args[expectedArg.name] = givenArg;
        }
        else {
            // Arg doesn't exist
            if (!expectedArg.required) {
                // Use default value
                result.args[expectedArg.name] = expectedArg.default;
            }
            else {
                // Mark as missing
                result.missing.push(expectedArg);
            }
        }
    });
    return result;
};

const SPACE = /\s/;
/**
 * Parses a string into an Array while supporting quoted strings
 *
 * @private
 * @param {string} str
 * @param {Array<string>} validQuotes
 * @returns {Array<string>}
 */
const splitWithQuotedStrings = (str, validQuotes) => {
    const result = [];
    let partStr = [];
    let inString = false;
    str.split("").forEach((letter, index) => {
        const isSpace = SPACE.test(letter);
        if (validQuotes.includes(letter)) {
            //Toggle inString once a quote is encountered
            inString = !inString;
        }
        else if (inString || !isSpace) {
            //push everything thats not a quote or a space(if outside quotes)
            partStr.push(letter);
        }
        if ((partStr.length > 0 && isSpace && !inString) ||
            index === str.length - 1) {
            //push current arg to container
            result.push(partStr.join(""));
            partStr = [];
        }
    });
    return result;
};
/**
 * Parses a string into an Array
 *
 * @private
 * @param {string} strInput
 * @param {Array<string>|null} validQuotes
 * @returns {Array<string>}
 */
const parseString = (strInput, validQuotes) => {
    const str = strInput.trim();
    // Only use the 'complex' algorithm if allowQuotedStrings is true
    return validQuotes !== null
        ? splitWithQuotedStrings(str, validQuotes)
        : str.split(SPACE);
};

/**
 * Default argument structure
 *
 * @private
 * @param {Object} arg
 * @param {number} index
 * @returns {Object}
 */
const argDefaultFactory = (index) => {
    return {
        name: `arg${index}`,
        required: true,
        default: null
    };
};

/**
 * Default command structure
 *
 * @private
 * @param {Object} arg
 * @param {number} index
 * @returns {Object}
 */
const commandDefaultFactory = (index) => {
    return {
        name: `command${index}`,
        fn: null,
        alias: [],
        args: [],
        sub: null
    };
};

/**
 * Default option structure
 */
const optionsDefault = {
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
const mapCommands = (commandEntries, caseSensitive) => new Map(commandEntries.map((command, index) => {
    if (!isString(command[0])) {
        throw new TypeError(`command key '${command[0]}' is not a string`);
    }
    const commandKey = caseSensitive
        ? command[0]
        : command[0].toLowerCase();
    const commandValue = objDefaultsDeep(command[1], commandDefaultFactory(index));
    // Save key as name property to keep track in aliases
    commandValue.name = commandKey;
    // Merge each arg with default arg structure
    commandValue.args = commandValue.args.map((arg, index) => objDefaults(arg, argDefaultFactory(index)));
    //If sub-groups exist, recurse by creating a new Clingy instance
    if (commandValue.sub !== null) {
        commandValue.sub = new Clingy(commandValue.sub);
    }
    return [commandKey, commandValue];
}));
/**
 * Clingy class
 *
 * @class
 */
const Clingy = class {
    /**
     * Creates Clingy instance
     *
     * @param {Object} commands Command object
     * @param {Object} options Option object
     */
    constructor(commands, options = {}) {
        this.options = objDefaultsDeep(options, optionsDefault);
        this.map = mapCommands(objEntries(commands), this.options.caseSensitive);
        this.mapAliased = getAliasedMap(this.map);
    }
    /**
     * Returns internal maps
     *
     * @returns {Object}
     */
    getAll() {
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
    getCommand(path, pathUsed = []) {
        const pathUsedNew = pathUsed;
        const commandNameCurrent = this.options.caseSensitive
            ? path[0]
            : path[0].toLowerCase();
        if (!this.mapAliased.has(commandNameCurrent)) {
            return {
                success: false,
                error: {
                    type: "missingCommand",
                    missing: [commandNameCurrent],
                    similar: similar(commandNameCurrent, arrFrom(this.mapAliased.keys()))
                },
                path: pathUsedNew
            };
        }
        const command = this.mapAliased.get(commandNameCurrent);
        const commandPathNew = path.slice(1);
        pathUsedNew.push(commandNameCurrent);
        // Recurse into sub if more items in path and sub exists
        if (path.length > 1 && command.sub !== null) {
            const commandSubResult = command.sub.getCommand(commandPathNew, pathUsedNew);
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
    parse(input) {
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
            return {
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
