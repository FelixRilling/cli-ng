import { logaloo } from "../logging";

/**
 * Manages parsing input strings into a pathUsed list.
 */
class InputParser {
    private readonly logger = logaloo.getLogger(InputParser);
    private readonly legalQuotes: string[];
    private readonly pattern: RegExp;

    // noinspection TsLint
    /**
     * Creates an {@link InputParser}.
     *
     * @param legalQuotes List of quotes to use when parsing strings.
     */
    constructor(legalQuotes: string[] = ['"']) {
        this.legalQuotes = legalQuotes;
        this.pattern = this.generateMatcher();
    }

    /**
     * Parses an input string.
     *
     * @param input Input string to parse.
     * @return Path list.
     */
    public parse(input: string): string[] {
        this.logger.debug(`Parsing input '${input}'`);

        return Array.from(<ArrayLike<string>>input.match(this.pattern));
    }

    private generateMatcher(): RegExp {
        const matchBase = "(\\S+)";

        this.logger.debug("Creating matcher.");
        const matchItems = this.legalQuotes
            .map((str: string): string => `\\Q${str}\\E`)
            .map(quote => `${quote}(.+?)${quote}`);

        matchItems.push(matchBase);

        let result: RegExp;

        try {
            result = new RegExp(matchItems.join("|"), "g");
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
