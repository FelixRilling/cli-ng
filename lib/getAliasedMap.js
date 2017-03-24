"use strict";

module.exports = function (map) {
    const result = new Map(map);

    for (let value of map.values()) {
        value.alias.forEach(alias => {
            result.set(alias, value);
        });
    }

    return result;
};
