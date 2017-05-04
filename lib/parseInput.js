"use strict";

const QUOTE = "\"";
const SPACE = /\s/;

/**
 * Parses a string into an Array
 * @private
 * @param {String} strInput
 * @returns {Array}
 */
module.exports = function (strInput) {
    const str = strInput.trim();
    const result = [];
    let inString = false;
    let partStr = [];

    str.split("").forEach(letter => {
        const isSpace = SPACE.test(letter);

        if (letter === QUOTE) { //Toggle instring once a quote is encountered
            inString = !inString;
        } else if (inString || !isSpace) { //push everything thats not a quote or a space(if outside quotes)
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
