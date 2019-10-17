import { isNil } from "lodash";
import { clingyLogby } from "../logger";
/**
 * Orchestrates mapping of {@link Argument}s to user-provided input.
 *
 * @private
 */
class ArgumentMatcher {
    /**
     * Matches a list of {@link Argument}s to a list of string input arguments.
     *
     * @param expected {@link Argument} list of a {@link ICommand}
     * @param provided List of user-provided arguments.
     */
    constructor(expected, provided) {
        this.missing = [];
        this.result = new Map();
        ArgumentMatcher.logger.debug("Matching arguments:", expected, provided);
        expected.forEach((expectedArg, i) => {
            if (i < provided.length) {
                const providedArg = provided[i];
                ArgumentMatcher.logger.trace(`Found matching argument for ${expectedArg.name}, adding to result: ${providedArg}`);
                this.result.set(expectedArg.name, providedArg);
            }
            else if (expectedArg.required) {
                ArgumentMatcher.logger.trace(`No matching argument found for ${expectedArg.name}, adding to missing.`);
                this.missing.push(expectedArg);
            }
            else if (!isNil(expectedArg.defaultValue)) {
                ArgumentMatcher.logger.trace(`No matching argument found for ${expectedArg.name}, using default: ${expectedArg.defaultValue}`);
                this.result.set(expectedArg.name, expectedArg.defaultValue);
            }
            else {
                ArgumentMatcher.logger.trace(`No matching argument found for ${expectedArg.name}, using null.`);
                this.result.set(expectedArg.name, null);
            }
        });
        ArgumentMatcher.logger.debug(`Finished matching arguments: ${expected.length} expected, ${this.result.size} found and ${this.missing.length} missing.`);
    }
}
ArgumentMatcher.logger = clingyLogby.getLogger(ArgumentMatcher);
export { ArgumentMatcher };
//# sourceMappingURL=ArgumentMatcher.js.map