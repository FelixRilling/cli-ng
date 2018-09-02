import {CommandMap} from "../CommandMap";
import {strSimilar} from "lightdash";

/**
 * Gets similar keys of a key based on their string distance.
 *
 * @param mapAliased Map to use for lookup.
 * @param name       Key to use.
 * @return List of similar keys.
 */
const getSimilar = (mapAliased: CommandMap, name: string): string[] =>
    <string[]>strSimilar(name, Array.from(mapAliased.keys()), false);

export {getSimilar};
