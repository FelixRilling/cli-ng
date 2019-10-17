import { Argument } from "./Argument";
import { ResolvedArgumentMap } from "./ResolvedArgumentMap";
/**
 * Orchestrates mapping of {@link Argument}s to user-provided input.
 *
 * @private
 */
declare class ArgumentMatcher {
    private static readonly logger;
    readonly missing: Argument[];
    readonly result: ResolvedArgumentMap;
    /**
     * Matches a list of {@link Argument}s to a list of string input arguments.
     *
     * @param expected {@link Argument} list of a {@link ICommand}
     * @param provided List of user-provided arguments.
     */
    constructor(expected: Argument[], provided: string[]);
}
export { ArgumentMatcher };
//# sourceMappingURL=ArgumentMatcher.d.ts.map