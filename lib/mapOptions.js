"use strict";

const _merge = require("lodash/merge");

const optionsDefault = function () {
    return {
        caseSensitive: true,
        suggestSimilar: true
    };
};

module.exports = options => _merge(optionsDefault, options);
