const SPACE = /\s/;

/**
 * Parses a string into an Array while supporting quoted strings
 *
 * @private
 * @param {string} str
 * @param {Array<string>} validQuotes
 * @returns {Array<string>}
 */
const splitWithQuotedStrings = (
    str: string,
    validQuotes: string[]
): string[] => {
    const result: string[] = [];
    let partStr: string[] = [];
    let inString = false;

    str.split("").forEach((letter, index) => {
        const isSpace = SPACE.test(letter);

        if (validQuotes.includes(letter)) {
            // Toggle inString once a quote is encountered
            inString = !inString;
        } else if (inString || !isSpace) {
            // Push everything thats not a quote or a space(if outside quotes)
            partStr.push(letter);
        }

        if (
            (partStr.length > 0 && isSpace && !inString) ||
            index === str.length - 1
        ) {
            // Push current arg to container
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
 * @param {Array<string>|null} validQuotes
 * @returns {Array<string>}
 */
const parseString = (strInput: string, validQuotes: string[]): string[] => {
    const str = strInput.trim();

    // Only use the 'complex' algorithm if allowQuotedStrings is true
    return validQuotes !== null
        ? splitWithQuotedStrings(str, validQuotes)
        : str.split(SPACE);
};

export default parseString;
