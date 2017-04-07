"use strict";

/**
 * Parses a string of the form "#name# #arg1# #'arg2 foo'# ... #argN#"
 */
const quotes = "\"";
const space = /(?:\n|\s)/;

module.exports = function (strInput) {
    const str = strInput.trim();
    const strArr = str.split("");
    const result = [];
    let inString = false;
    let partStr = [];

    strArr.forEach((letter, index) => {
        if (letter === quotes) { //Toggle instring once a quote is encountered
            inString = !inString;
        } else if (inString || !space.test(letter)) { //push everything thats not a quote or a space(if outside quotes)
            partStr.push(letter);
        }

        if ((space.test(letter) && !inString) || index === strArr.length - 1) { //push current arg to container
            result.push(partStr.join(""));
            partStr = [];
        }
    });

    return {
        name: result[0],
        args: result.splice(1)
    };
};
