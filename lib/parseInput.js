"use strict";

const SPACE = /\s/;

/**
 * Parses a string into an Array while supporting quoted strings
 *
 * @private
 * @param {string} str
 * @param {Array<string>} validQuotes
 * @returns {Array<string>}
 */
const splitWithQuotedStrings = function (str, validQuotes) {
    const result = [];
    let inString = false;
    let partStr = [];

    str.split("").forEach((letter, index) => {
        const isSpace = SPACE.test(letter);

        if (validQuotes.includes(letter)) {
            //Toggle inString once a quote is encountered
            inString = !inString;
        } else if (inString || !isSpace) {
            //push everything thats not a quote or a space(if outside quotes)
            partStr.push(letter);
        }

        if ((partStr.length > 0 && isSpace && !inString) || index === str.length - 1) { //push current arg to container
            result.push(partStr.join(""));
            partStr = [];
        }
    });

    return result;
};

/**
 * Parses a string into an Array
 *
 * @private
 * @param {string} strInput
 * @param {Object} optionsParser
 * @returns {Array<string>}
 */
module.exports = function (strInput, validQuotes) {
    const str = strInput.trim();

    //Only use the 'complex' algorithm if allowQuotedStrings is true
    return validQuotes !== null ? splitWithQuotedStrings(str, validQuotes) : str.split(SPACE);
};
