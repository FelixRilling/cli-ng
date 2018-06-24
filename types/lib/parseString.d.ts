/**
 * Parses a string into an Array while supporting quoted strings.
 *
 * @private
 * @param {string} str string to parse.
 * @param {Array<string>} validQuotes array of valid quotes.
 * @returns {Array<string>} list of parsed strings.
 */
declare const parseString: (str: string, validQuotes: string[]) => string[];
export { parseString };
