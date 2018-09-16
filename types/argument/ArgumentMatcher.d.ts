import { IArgument } from "./IArgument";
import { resolvedArgumentMap } from "./resolvedArgumentMap";
/**
 * Orchestrates mapping of {@link IArgument}s to user-provided input.
 */
declare class ArgumentMatcher {
    private static readonly logger;
    readonly missing: IArgument[];
    readonly result: resolvedArgumentMap;
    /**
     * Matches a list of {@link IArgument}s to a list of string input arguments.
     *
     * @param expected {@link Argument} list of a {@link ICommand}
     * @param provided List of user-provided arguments.
     */
    constructor(expected: IArgument[], provided: string[]);
}
export { ArgumentMatcher };
