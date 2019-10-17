import { similar } from "lightdash";
/**
 * Gets similar keys of a key based on their string distance.
 *
 * @private
 * @param mapAliased Map to use for lookup.
 * @param name       Key to use.
 * @return List of similar keys.
 */
const getSimilar = (mapAliased, name) => similar(name, Array.from(mapAliased.keys()), false);
export { getSimilar };
//# sourceMappingURL=commandUtil.js.map