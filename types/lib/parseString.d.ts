/**
 * Parses a string into an Array while supporting quoted strings
 *
 * @private
 * @param {string} str
 * @param {Array<string>} validQuotes
 * @returns {Array<string>}
 */
declare const parseString: (str: string, validQuotes: string[]) => string[];
export { parseString };
