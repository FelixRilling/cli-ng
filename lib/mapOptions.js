"use strict";

const _merge = require("lodash/merge");

/**
 * Default option structure
 * @returns {Object}
 */
const optionsDefault = function () {
    return {
        /**
         * Options for Lookup (Resolving a command from a string)
         */
        lookup: {
            /**
             * If names should be treated case-sensitive for lookup
             */
            namesAreCaseSensitive: true
        },
        /**
         * Options for Parser (Getting an Array of name/arg strings from a String)
         */
        parser: {
            /**
             * If strings containing spaces should be kept together when enclosed in quotes.
             * true:    'hello world "foo bar"' => ["hello", "world", "foo bar"]
             * false:   'hello world "foo bar"' => ["hello", "world", "\"foo", "bar\""]
             */
            allowQuotedStrings: true,
            /**
             * [Only works with allowQuotedStrings=true]
             * List of characters to support enclosing quotedStrings for
             */
            validQuotes: ["\""],
        }
    };
};


/**
 * Matches and merges with default options
 * @param {Object} options
 * @returns {Object}
 */
module.exports = options => _merge(optionsDefault(), options);
