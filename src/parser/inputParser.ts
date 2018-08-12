import * as loglevel from "loglevel";

/**
 * Manages parsing input strings into a pathUsed list.
 */
class InputParser {
    /**
     * Creates an {@link InputParser}.
     *
     * @param legalQuotes List of quotes to use when parsing strings.
     */
    constructor(legalQuotes: string[] = ['"']) {
        this.legalQuotes = legalQuotes;
        this.pattern = this.generateMatcher();
    }
    private readonly logger: loglevel.Logger = loglevel.getLogger(
        "InputParser"
    );
    private readonly legalQuotes: string[];
    private readonly pattern: RegExp;

    private static escapeRegexCharacter(str: string): string {
        return `\\Q${str}\\E`;
    }

    /**
     * Parses an input string.
     *
     * @param input Input string to parse.
     * @return Path list.
     */
    public parse(input: string): string[] {
        this.logger.debug("Parsing input '{}'", input);

        // @ts-ignore Can be converted to array, despite what TS says.
        return Array.from(input.match(this.pattern));
    }

    private generateMatcher(): RegExp {
        const matchBase = "(\\S+)";

        this.logger.debug("Creating matcher.");
        const matchItems = this.legalQuotes
            .map(InputParser.escapeRegexCharacter)
            .map(quote => `${quote}(.+?)${quote}`);

        matchItems.push(matchBase);

        let result: RegExp;

        try {
            result = new RegExp(matchItems.join("|"), "");
        } catch (e) {
            this.logger.error(
                "The parsing pattern is invalid, this should never happen.",
                e
            );
            throw e;
        }

        return result;
    }
}

export { InputParser };
