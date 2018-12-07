import { CommandMap } from "../command/CommandMap";
import { commandPath } from "../command/commandPath";
import { ILookupResult } from "./result/ILookupResult";
/**
 * Lookup tools for resolving paths through {@link CommandMap}s.
 *
 * @private
 */
declare class LookupResolver {
    private static readonly logger;
    private readonly caseSensitive;
    /**
     * Creates a new {@link LookupResolver}.
     *
     * @param caseSensitive If the lookup should honor case.
     */
    constructor(caseSensitive?: boolean);
    /**
     * Resolves a pathUsed through a {@link CommandMap}.
     *
     * @param mapAliased     Map to use.
     * @param path           Path to getPath.
     * @param parseArguments If dangling pathUsed items should be treated as arguments.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    resolve(mapAliased: CommandMap, path: commandPath, parseArguments?: boolean): ILookupResult;
    private static createSuccessResult;
    private static createNotFoundResult;
    private static createMissingArgsResult;
    private resolveInternal;
    private resolveInternalSub;
}
export { LookupResolver };
