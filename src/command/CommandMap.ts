import { isMap, isObject } from "lightdash";
import { ICommand } from "./ICommand";
import { IObjWithCommands } from "./IObjWithCommands";
import { mapWithCommands } from "./mapWithCommands";

const getConstructorMap = (
    input?: mapWithCommands | IObjWithCommands
): ReadonlyArray<[string, ICommand]> | null => {
    if (isMap(input)) {
        return Array.from((<mapWithCommands>input).entries());
    } else if (isObject(input)) {
        return Array.from(Object.entries(<object>input));
    }

    return null;
};

/**
 * Map containing {@link ICommand}s.
 */
class CommandMap extends Map<string, ICommand> {
    constructor(input?: mapWithCommands | IObjWithCommands) {
        super(getConstructorMap(input));
    }

    /**
     * Checks if the map contains a key, ignoring case.
     *
     * @param key Key to check for.
     * @return If the map contains a key, ignoring case.
     */
    public hasIgnoreCase(key: string): boolean {
        return Array.from(this.keys())
            .map(k => k.toLowerCase())
            .includes(key.toLowerCase());
    }

    /**
     * Returns the value for the key, ignoring case.
     *
     * @param key Key to check for.
     * @return The value for the key, ignoring case.
     */
    public getIgnoreCase(key: string): ICommand | null {
        let result: ICommand | null = null;

        this.forEach((value, k) => {
            if (key.toLowerCase() === k.toLowerCase()) {
                result = value;
            }
        });

        return result;
    }
}

export { CommandMap };
