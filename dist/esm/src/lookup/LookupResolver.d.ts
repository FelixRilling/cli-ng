import { CommandMap } from "../command/CommandMap";
import { CommandPath } from "../command/CommandPath";
import { ArgumentResolving } from "./ArgumentResolving";
import { LookupResult } from "./result/LookupResult";
/**
 * Lookup tools for resolving paths through {@link CommandMap}s.
 *
 * @private
 */
declare class LookupResolver {
    private static readonly logger;
    private readonly caseSensitivity;
    /**
     * Creates a new {@link LookupResolver}.
     *
     * @param caseSensitive If the lookup should honor case.
     */
    constructor(caseSensitive?: boolean);
    private static createSuccessResult;
    private static createNotFoundResult;
    private static createMissingArgsResult;
    /**
     * Resolves a pathUsed through a {@link CommandMap}.
     *
     * @param commandMap        Map to use.
     * @param path              Path to getPath.
     * @param argumentResolving Strategy for resolving arguments.
     * @return Lookup result, either {@link LookupSuccess}, {@link LookupErrorNotFound}
     * or {@link LookupErrorMissingArgs}.
     */
    resolve(commandMap: CommandMap, path: CommandPath, argumentResolving: ArgumentResolving): LookupResult;
    private resolveInternal;
    private resolveInternalSub;
    private hasCommand;
}
export { LookupResolver };
//# sourceMappingURL=LookupResolver.d.ts.map