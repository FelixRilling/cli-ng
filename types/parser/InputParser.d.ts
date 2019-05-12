/**
 * Manages parsing input strings into a path list.
 *
 * @private
 */
declare class InputParser {
    private static readonly logger;
    readonly legalQuotes: string[];
    readonly pattern: RegExp;
    /**
     * Creates an {@link InputParser}.
     *
     * @param legalQuotes List of quotes to use when parsing strings.
     */
    constructor(legalQuotes?: string[]);
    /**
     * Parses an input string.
     *
     * @param input Input string to parse.
     * @return Path list.
     */
    parse(input: string): string[];
    private generateMatcher;
}
export { InputParser };
