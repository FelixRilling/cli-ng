"use strict";

module.exports = function (map, key, val) {
    const value = Object.assign({}, val);

    value.name = key;
    map.set(key, value);

    return map;
};
