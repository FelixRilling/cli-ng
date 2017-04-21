"use strict";

/**
 * converts string to value type
 * @private
 * @param {String} val
 * @param {String} type
 * @returns {String|Number|Boolean}
 */
module.exports = function (val, type) {
    if (type === "string") {
        return val;
    } else if (type === "number") {
        return Number(val);
    } else if (type === "boolean") {
        return Boolean(val);
    }
};
