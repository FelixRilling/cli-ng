"use strict";

module.exports = function (key, val) {
    const value = Object.assign({}, val);

    value.name = key;

    return value;
};
