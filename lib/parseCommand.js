"use strict";

/**
 * Parses a string of the form "#name# #arg1# #'arg2 foo'# ... #argN#"
 */
const quotes = "\"";
const space = " ";

module.exports = function (strInput) {
    const str = strInput.trim();
    const commandEndPos = str.indexOf(" ");
    const result = {
        name: "",
        args: []
    };

    //If no parameters are present skip this block
    if (commandEndPos !== -1) {
        const argLetters = str.substr(commandEndPos + 1).split("");
        let inString = false;
        let partStr = [];

        result.name = str.substr(0, commandEndPos);

        argLetters.forEach((letter, index) => {
            if (letter === quotes) { //Toggle instring once a quote is encountered
                inString = !inString;
            } else if (inString || letter !== space) { //push everything thats not a quote or a space(if outside quotes)
                partStr.push(letter);
            }

            if ((letter === space && !inString) || index === argLetters.length - 1) { //push current arg to container
                result.args.push(partStr.join(""));
                partStr = [];
            }
        });
    } else {
        result.name = str;
    }

    return result;
};
