import { IClingyCommand } from "./command";

type clingyCommandMap = Map<string, IClingyCommand>;

/**
 * Creates an aliased map from a normal map.
 *
 * @private
 * @param {Map} map command map to alias.
 * @returns {Map} aliased command map.
 */
const getAliasedMap = (map: clingyCommandMap): clingyCommandMap => {
    const result = new Map(map);

    map.forEach((command: IClingyCommand) => {
        command.alias.forEach((alias: string) => {
            if (result.has(alias)) {
                throw new Error(
                    `Alias '${alias}' conflicts with a previously defined key`
                );
            }

            result.set(alias, command);
        });
    });

    return result;
};

export { getAliasedMap, clingyCommandMap };
