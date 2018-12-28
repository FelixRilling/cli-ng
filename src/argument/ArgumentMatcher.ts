import { isNil } from "lightdash";
import { ILogger } from "logby";
import { clingyLogby } from "../logger";
import { IArgument } from "./IArgument";
import { resolvedArgumentMap } from "./resolvedArgumentMap";

/**
 * Orchestrates mapping of {@link IArgument}s to user-provided input.
 *
 * @private
 */
class ArgumentMatcher {
    private static readonly logger: ILogger = clingyLogby.getLogger(
        ArgumentMatcher
    );

    public readonly missing: IArgument[];
    public readonly result: resolvedArgumentMap;

    /**
     * Matches a list of {@link IArgument}s to a list of string input arguments.
     *
     * @param expected {@link Argument} list of a {@link ICommand}
     * @param provided List of user-provided arguments.
     */
    constructor(expected: IArgument[], provided: string[]) {
        this.missing = [];
        this.result = new Map<string, string>();

        ArgumentMatcher.logger.debug("Matching arguments:", expected, provided);

        expected.forEach((expectedArg, i) => {
            if (i < provided.length) {
                const providedArg = provided[i];

                ArgumentMatcher.logger.trace(
                    `Found matching argument for ${
                        expectedArg.name
                    }, adding to result: ${providedArg}`
                );
                this.result.set(expectedArg.name, providedArg);
            } else if (expectedArg.required) {
                ArgumentMatcher.logger.trace(
                    `No matching argument found for ${
                        expectedArg.name
                    }, adding to missing.`
                );
                this.missing.push(expectedArg);
            } else if (!isNil(expectedArg.defaultValue)) {
                ArgumentMatcher.logger.trace(
                    `No matching argument found for ${
                        expectedArg.name
                    }, using default: ${expectedArg.defaultValue}`
                );
                this.result.set(expectedArg.name, expectedArg.defaultValue);
            } else {
                ArgumentMatcher.logger.trace(
                    `No matching argument found for ${
                        expectedArg.name
                    }, using null.`
                );
                this.result.set(expectedArg.name, null);
            }
        });

        ArgumentMatcher.logger.debug(
            `Finished matching arguments: ${expected.length} expected, ${
                this.result.size
            } found and ${this.missing.length} missing.`
        );
    }
}

export { ArgumentMatcher };
