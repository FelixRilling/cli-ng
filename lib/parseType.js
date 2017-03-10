"use strict";

module.exports = function (val, type) {
    if (type === "string") {
        return val;
    } else if (type === "number") {
        const number = Number(val);

        return isNaN(number) ? null : number;
    } else if (type === "boolean") {
        return Boolean(val);
    }
};
