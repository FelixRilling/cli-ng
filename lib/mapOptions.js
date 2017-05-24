"use strict";

const _merge = require("lodash/merge");

/**
 * Default option structure
 * @returns {Object}
 */
const optionsDefault = function () {
    return {
        caseSensitive: true,
        suggestSimilar: true
    };
};


/**
 * Matches and merges with default options
 * @param {Object} options
 * @returns {Object}
 */
module.exports = options => _merge(optionsDefault, options);
