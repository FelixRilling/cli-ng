import { forEach, isMap, isObject, isPlainObject } from "lodash";
import { Clingy } from "../Clingy";
import { CaseSensitivity } from "../lookup/CaseSensitivity";
/**
 * Map containing {@link Command}s.
 *
 * @private
 */
class CommandMap extends Map {
    constructor(input) {
        super(CommandMap.getConstructorMap(input));
    }
    /**
     * Creates a new instance with {@link Clingy} options to inherit.
     *
     * @param commands Command input to use.
     * @param options Options for the Clingy instance.
     */
    static createWithOptions(commands, options) {
        if (isMap(commands)) {
            commands.forEach(val => CommandMap.createWithOptionsHelper(val, options));
        }
        else if (isPlainObject(commands)) {
            forEach(commands, val => CommandMap.createWithOptionsHelper(val, options));
        }
        return new CommandMap(commands);
    }
    static createWithOptionsHelper(command, options) {
        if (isPlainObject(command.sub) || isMap(command.sub)) {
            command.sub = new Clingy(CommandMap.createWithOptions(command.sub, options), options);
        }
    }
    static getConstructorMap(input) {
        if (isMap(input)) {
            return Array.from(input.entries());
        }
        if (isObject(input)) {
            return Array.from(Object.entries(input));
        }
        return null;
    }
    /**
     * Checks if the map contains a key, ignoring case.
     *
     * @param key Key to check for.
     * @param caseSensitivity Case sensitivity to use.
     * @return If the map contains a key, ignoring case.
     */
    hasCommand(key, caseSensitivity) {
        if (caseSensitivity === CaseSensitivity.INSENSITIVE) {
            return Array.from(this.keys())
                .map(k => k.toLowerCase())
                .includes(key.toLowerCase());
        }
        return this.has(key);
    }
    /**
     * Returns the value for the key, ignoring case.
     *
     * @param key Key to check for.
     * @param caseSensitivity Case sensitivity to use.
     * @return The value for the key, ignoring case.
     */
    getCommand(key, caseSensitivity) {
        if (caseSensitivity === CaseSensitivity.INSENSITIVE) {
            let result = null;
            this.forEach((value, k) => {
                if (key.toLowerCase() === k.toLowerCase()) {
                    result = value;
                }
            });
            return result;
        }
        // Return null instead of undefined to be backwards compatible.
        return this.has(key) ? this.get(key) : null;
    }
}
export { CommandMap };
//# sourceMappingURL=CommandMap.js.map