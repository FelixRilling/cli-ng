"use strict";

/**
 * Creates an aliased map from a normal map
 * @private
 * @param {Map} map
 * @returns {Map}
 */
module.exports = function (map) {
    const result = new Map(map);

    map.forEach(command => {
        command.alias.forEach(alias => {
            if (result.has(alias)) {
                throw new Error(`Alias ${alias} conflicts with a previously defined key`);
            } else {
                result.set(alias, command);
            }
        });
    });

    return result;
};
