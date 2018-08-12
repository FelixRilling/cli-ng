/**
 * Manages parsing input strings into a pathUsed list.
 */
declare class InputParser {
    /**
     * Creates an {@link InputParser}.
     *
     * @param legalQuotes List of quotes to use when parsing strings.
     */
    constructor(legalQuotes?: string[]);
    private readonly logger;
    private readonly legalQuotes;
    private readonly pattern;
    private static escapeRegexCharacter;
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
