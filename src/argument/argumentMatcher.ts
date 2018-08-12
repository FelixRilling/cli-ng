import { logaloo } from "../logaloo/logaloo";
import { IArgument } from "./IArgument";

type resolvedArgumentMap = Map<string, string>;

/**
 * Orchestrates mapping of {@link IArgument}s to user-provided input.
 */
class ArgumentMatcher {
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
        this.result = new Map();

        const logger = logaloo.getLogger(ArgumentMatcher);
        logger.debug("Matching arguments {} with {}", expected, provided);

        expected.forEach((expectedArg, i) => {
            if (i < provided.length) {
                logger.trace(
                    "Found matching argument for {}, adding to result: {}",
                    expectedArg.name,
                    provided[i]
                );
                this.result.set(expectedArg.name, provided[i]);
            } else if (!expectedArg.required) {
                logger.trace(
                    "No matching argument found for {}, using default: {}",
                    expectedArg.name,
                    expectedArg.defaultValue
                );
                this.result.set(expectedArg.name, expectedArg.defaultValue);
            } else {
                logger.trace(
                    "No matching argument found for {}, adding to missing.",
                    expectedArg.name
                );
                this.missing.push(expectedArg);
            }
        });

        logger.debug(
            "Finished matching arguments: {} expected, {} found and {} missing.",
            expected.length,
            this.result.size,
            this.missing.length
        );
    }
}

export { ArgumentMatcher, resolvedArgumentMap };
