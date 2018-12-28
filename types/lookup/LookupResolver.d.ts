import { CommandMap } from "../command/CommandMap";
import { commandPath } from "../command/commandPath";
import { ILookupResult } from "./result/ILookupResult";
import { ArgumentResolving } from "./ArgumentResolving";
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
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    resolve(commandMap: CommandMap, path: commandPath, argumentResolving: ArgumentResolving): ILookupResult;
    private resolveInternal;
    private resolveInternalSub;
    private hasCommand;
}
export { LookupResolver };
