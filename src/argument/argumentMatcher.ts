import {IArgument} from "./IArgument";
import * as loglevel from "loglevel";

type resolvedArgumentMap = Map<string, string>;

class ArgumentMatcher {
    public readonly missing: IArgument[];
    public readonly result: resolvedArgumentMap;

    constructor(expected: IArgument[], provided: string[]) {
        this.missing = [];
        this.result = new Map();

        const logger = loglevel.getLogger("ArgumentMatcher");
        logger.debug("Matching arguments {} with {}", expected, provided);

        expected.forEach((expectedArg, i) => {
            if (i < provided.length) {
                logger.trace("Found matching argument for {}, adding to result: {}", expectedArg.name, provided[i]);
                this.result.set(expectedArg.name, provided[i]);
            } else if (!expectedArg.required) {
                logger.trace("No matching argument found for {}, using default: {}", expectedArg.name, expectedArg.defaultValue);
                this.result.set(expectedArg.name, expectedArg.defaultValue);
            } else {
                logger.trace("No matching argument found for {}, adding to missing.", expectedArg.name);
                this.missing.push(expectedArg);
            }
        });

        logger.debug("Finished matching arguments: {} expected, {} found and {} missing.", expected.length, this.result.size, this.missing.length);
    }
}

export {ArgumentMatcher, resolvedArgumentMap};
