import { CommandMap } from "../CommandMap";
/**
 * Gets similar keys of a key based on their string distance.
 *
 * @param mapAliased Map to use for lookup.
 * @param name       Key to use.
 * @return List of similar keys.
 */
declare const getSimilar: (mapAliased: CommandMap, name: string) => string[];
export { getSimilar };
