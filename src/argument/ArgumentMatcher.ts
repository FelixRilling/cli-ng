import { clingyLoggerRoot } from "../loggerRoot";
import { IArgument } from "./IArgument";
import { resolvedArgumentMap } from "./resolvedArgumentMap";
import { isNil } from "lightdash";

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

        const logger = clingyLoggerRoot.getLogger(ArgumentMatcher);
        logger.debug(`Matching arguments ${expected} with ${provided}`);

        expected.forEach((expectedArg, i) => {
            if (i < provided.length) {
                const providedArg = provided[i];

                logger.trace(
                    `Found matching argument for ${
                        expectedArg.name
                    }, adding to result: ${providedArg}`
                );
                this.result.set(expectedArg.name, providedArg);
            } else if (
                !expectedArg.required &&
                !isNil(expectedArg.defaultValue)
            ) {
                logger.trace(
                    `No matching argument found for ${
                        expectedArg.name
                    }, using default: ${expectedArg.defaultValue}`
                );
                this.result.set(expectedArg.name, expectedArg.defaultValue);
            } else {
                logger.trace(
                    `No matching argument found for ${
                        expectedArg.name
                    }, adding to missing.`
                );
                this.missing.push(expectedArg);
            }
        });

        logger.debug(
            `Finished matching arguments: ${expected.length} expected, ${
                this.result.size
            } found and ${this.missing.length} missing.`
        );
    }
}

export { ArgumentMatcher };
