"use strict";

const _merge = require("lodash/merge");

/**
 * Default option structure
 * @returns {Object}
 */
const optionsDefault = function () {
    return {
        //If names should be treated case-sensitive for lookup
        namesAreCaseSensitive: true,
        //If, when more arguments than supported are given, an error should be returned
        allowDangelingArgs: true
    };
};


/**
 * Matches and merges with default options
 * @param {Object} options
 * @returns {Object}
 */
module.exports = options => _merge(optionsDefault, options);
