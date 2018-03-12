import { IClingyCommand } from "../interfaces";
import { clingyCommandMap } from "../types";

/**
 * Creates an aliased map from a normal map
 *
 * @private
 * @param {Map} map
 * @returns {Map}
 */
const getAliasedMap = (map: clingyCommandMap): clingyCommandMap => {
    const result = new Map(map);

    map.forEach((command: IClingyCommand) => {
        command.alias.forEach((alias: string) => {
            if (result.has(alias)) {
                throw new Error(
                    `Alias ${alias} conflicts with a previously defined key`
                );
            } else {
                result.set(alias, command);
            }
        });
    });

    return result;
};

export default getAliasedMap;
