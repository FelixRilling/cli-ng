import { ICommand } from "./ICommand";

/**
 * Map containing {@link ICommand}s.
 */
class CommandMap extends Map<string, ICommand> {
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
        this.forEach((value, k) => {
            if (key.toLowerCase() === k.toLowerCase()) {
                return value;
            }
        });

        return null;
    }
}

export { CommandMap };
