"use strict";

module.exports = function (val, type) {
    if (type === "string") {
        return val;
    } else if (type === "number") {
        return Number(val);
    } else if (type === "boolean") {
        return Boolean(val);
    }
};
