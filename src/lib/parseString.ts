const SPACE = /\s/;

/**
 * Parses a string into an Array while supporting quoted strings.
 *
 * @private
 * @param {string} str string to parse.
 * @param {Array<string>} validQuotes array of valid quotes.
 * @returns {Array<string>} list of parsed strings.
 */
const parseString = (str: string, validQuotes: string[]): string[] => {
    const result: string[] = [];
    let partStr: string[] = [];
    let isInString = false;

    str.trim()
        .split("")
        .forEach((letter, index) => {
            const isSpace = SPACE.test(letter);

            if (validQuotes.includes(letter)) {
                isInString = !isInString;
            } else if (isInString || !isSpace) {
                partStr.push(letter);
            }

            if (
                (partStr.length > 0 && isSpace && !isInString) ||
                index === str.length - 1
            ) {
                result.push(partStr.join(""));
                partStr = [];
            }
        });

    return result;
};

export { parseString };
