"use strict";

/**
 * Parses a string of the form "#name# #arg1# #'arg2 foo'# ... #argN#"
 */
const quotes = ["\""];
const space = /\s/;

module.exports = function (strInput) {
    const str = strInput.trim();
    const strArr = str.split("");
    const result = [];
    let inString = false;
    let partStr = [];

    strArr.forEach(letter => {
        const isSpace = space.test(letter);

        if (quotes.includes(letter)) { //Toggle instring once a quote is encountered
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

    return {
        name: result[0],
        args: result.splice(1)
    };
};
