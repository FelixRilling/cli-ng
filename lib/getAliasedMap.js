"use strict";

module.exports = function (map) {
    const result = new Map(map);

    for (let [key, value] of map) {
        value.alias.forEach(alias => {
            result.set(alias, value);
        });
    }

    return result;
};
