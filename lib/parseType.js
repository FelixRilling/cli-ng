"use strict";

/**
 * Converts string to value type
 * @private
 * @param {String} val
 * @param {String} type
 * @returns {String|Number|Boolean}
 */
module.exports = function (val, type) {
    if (type === "number") {
        return Number(val);
    } else if (type === "boolean") {
        return Boolean(val);
    } else {
        return val;
    }
};
