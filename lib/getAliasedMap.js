"use strict";

/**
 * Creates an aliased map from a normal map
 * @private
 * @param {Map} map
 * @returns {Map}
 */
module.exports = function (map) {
    const result = new Map(map);

    map.forEach(command=>{
        command.alias.forEach(alias => {
            result.set(alias, command);
        });
    });

    return result;
};
