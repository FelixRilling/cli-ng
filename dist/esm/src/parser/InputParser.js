import { compact } from "lodash";
import { clingyLogby } from "../logger";
/**
 * Manages parsing input strings into a path list.
 *
 * @private
 */
class InputParser {
    // noinspection TsLint
    /**
     * Creates an {@link InputParser}.
     *
     * @param legalQuotes List of quotes to use when parsing strings.
     */
    constructor(legalQuotes = ['"']) {
        this.legalQuotes = legalQuotes;
        this.pattern = this.generateMatcher();
    }
    /**
     * Parses an input string.
     *
     * @param input Input string to parse.
     * @return Path list.
     */
    parse(input) {
        InputParser.logger.debug(`Parsing input '${input}'`);
        const result = [];
        const pattern = new RegExp(this.pattern);
        let match;
        // noinspection AssignmentResultUsedJS
        while ((match = pattern.exec(input))) {
            InputParser.logger.trace(`Found match '${match}'`);
            const groups = compact(match.slice(1));
            if (groups.length > 0) {
                InputParser.logger.trace(`Found group '${groups[0]}'`);
                result.push(groups[0]);
            }
        }
        return result;
    }
    generateMatcher() {
        InputParser.logger.debug("Creating matcher.");
        const matchBase = "(\\S+)";
        const matchItems = this.legalQuotes
            .map((str) => `\\${str}`)
            .map(quote => `${quote}(.+?)${quote}`);
        matchItems.push(matchBase);
        let result;
        try {
            result = new RegExp(matchItems.join("|"), "g");
        }
        catch (e) {
            InputParser.logger.error("The parsing pattern is invalid, this should never happen.", e);
            throw e;
        }
        return result;
    }
}
InputParser.logger = clingyLogby.getLogger(InputParser);
export { InputParser };
//# sourceMappingURL=InputParser.js.map