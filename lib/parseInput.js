"use strict";

const SPACE = /\s/;

/**
 * Parses a string into an Array while supporting quoted strings
 * @private
 * @param {String} str
 * @param {Array} validQuotes
 * @returns {Array}
 */
const splitWithQuotedStrings = function (str, validQuotes) {
    const result = [];
    let inString = false;
    let partStr = [];

    str.split("").forEach(letter => {
        const isSpace = SPACE.test(letter);

        if (validQuotes.includes(letter)) {
            //Toggle inString once a quote is encountered
            inString = !inString;
        } else if (inString || !isSpace) {
            //push everything thats not a quote or a space(if outside quotes)
            partStr.push(letter);
        }

        if (partStr.length > 0 && (isSpace && !inString)) { //push current arg to container
            result.push(partStr.join(""));
            partStr = [];
        }
    });

    result.push(partStr.join(""));
    partStr = [];

    return result;
};

/**
 * Parses a string into an Array
 * @private
 * @param {String} strInput
 * @param {Object} optionsParser
 * @returns {Array}
 */
module.exports = function (strInput, optionsParser) {
    const str = strInput.trim();

    //Only use the 'complex' algorithm if allowQuotedStrings is true
    return optionsParser.allowQuotedStrings ? splitWithQuotedStrings(str, optionsParser.validQuotes) : str.split(SPACE);
};
