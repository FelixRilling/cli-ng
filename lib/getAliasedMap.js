"use strict";

module.exports = function (map) {
    const result = new Map();

    for (let [key, value] of map) {
        result.set(key, value);

        value.alias.forEach(alias => {
            result.set(alias, value);
        });
    }

    return result;
};
