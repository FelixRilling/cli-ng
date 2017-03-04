"use strict";

/**
 * Parses a string of the form "#name# #arg1# #'arg2 foo'# ... #argN#"
 */
const quotes = "\"";
const space = " ";

module.exports = function (strInput) {
    const str = strInput.trim();
    const argLetters = str.split("");
    const lettersSize=argLetters.length - 1;
    const result=[];
    let inString = false;
    let partStr = [];

    argLetters.forEach((letter, index) => {
        if (letter === quotes) { //Toggle instring once a quote is encountered
            inString = !inString;
        } else if (inString || letter !== space) { //push everything thats not a quote or a space(if outside quotes)
            partStr.push(letter);
        }

        if ((letter === space && !inString) || index === lettersSize) { //push current arg to container
            result.push(partStr.join(""));
            partStr = [];
        }
    });

    return {
        name: result[0],
        args: result.splice(1)
    };
};
