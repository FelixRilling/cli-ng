import { isNil } from "lodash";
import { ArgumentMatcher } from "../argument/ArgumentMatcher";
import { Clingy } from "../Clingy";
import { getSimilar } from "../command/util/commandUtil";
import { clingyLogby } from "../logger";
import { ArgumentResolving } from "./ArgumentResolving";
import { CaseSensitivity } from "./CaseSensitivity";
import { ResultType } from "./result/ILookupResult";
/**
 * Lookup tools for resolving paths through {@link CommandMap}s.
 *
 * @private
 */
class LookupResolver {
    /**
     * Creates a new {@link LookupResolver}.
     *
     * @param caseSensitive If the lookup should honor case.
     */
    constructor(caseSensitive = true) {
        this.caseSensitivity = caseSensitive
            ? CaseSensitivity.SENSITIVE
            : CaseSensitivity.INSENSITIVE;
    }
    static createSuccessResult(pathNew, pathUsed, command, args) {
        const lookupSuccess = {
            successful: true,
            pathUsed,
            pathDangling: pathNew,
            type: ResultType.SUCCESS,
            command,
            args
        };
        LookupResolver.logger.debug("Returning successful lookup result:", lookupSuccess);
        return lookupSuccess;
    }
    static createNotFoundResult(pathNew, pathUsed, currentPathFragment, commandMap) {
        LookupResolver.logger.warn(`Command '${currentPathFragment}' could not be found.`);
        return {
            successful: false,
            pathUsed,
            pathDangling: pathNew,
            type: ResultType.ERROR_NOT_FOUND,
            missing: currentPathFragment,
            similar: getSimilar(commandMap, currentPathFragment)
        };
    }
    static createMissingArgsResult(pathNew, pathUsed, missing) {
        LookupResolver.logger.warn("Some arguments could not be found:", missing);
        return {
            successful: false,
            pathUsed,
            pathDangling: pathNew,
            type: ResultType.ERROR_MISSING_ARGUMENT,
            missing
        };
    }
    /**
     * Resolves a pathUsed through a {@link CommandMap}.
     *
     * @param commandMap        Map to use.
     * @param path              Path to getPath.
     * @param argumentResolving Strategy for resolving arguments.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    resolve(commandMap, path, argumentResolving) {
        if (path.length === 0) {
            throw new Error("Path cannot be empty.");
        }
        return this.resolveInternal(commandMap, path, [], argumentResolving);
    }
    resolveInternal(commandMap, path, pathUsed, argumentResolving) {
        const currentPathFragment = path[0];
        const pathNew = path.slice(1);
        pathUsed.push(currentPathFragment);
        if (!this.hasCommand(commandMap, currentPathFragment)) {
            return LookupResolver.createNotFoundResult(pathNew, pathUsed, currentPathFragment, commandMap);
        }
        // We already checked if the key exists, assert its existence.
        const command = (commandMap.getCommand(currentPathFragment, this.caseSensitivity));
        LookupResolver.logger.debug(`Found command: '${currentPathFragment}'.`);
        /*
         * Recurse into sub-commands if:
         * Additional items are in the path AND
         * the current command has sub-commands AND
         * the sub-commands contain the next path item.
         */
        if (pathNew.length > 0 &&
            command.sub instanceof Clingy &&
            this.hasCommand(command.sub.mapAliased, pathNew[0])) {
            return this.resolveInternalSub(pathNew, pathUsed, command, argumentResolving);
        }
        /*
         * Skip checking for arguments if:
         * The parameter argumentResolving is set to ignore arguments OR
         * the command has no arguments defined OR
         * the command has an empty array defined as arguments.
         */
        let argumentsResolved;
        if (argumentResolving === ArgumentResolving.IGNORE ||
            isNil(command.args) ||
            command.args.length === 0) {
            LookupResolver.logger.debug("No arguments defined, using empty map.");
            argumentsResolved = new Map();
        }
        else {
            LookupResolver.logger.debug(`Looking up arguments: '${pathNew}'.`);
            const argumentMatcher = new ArgumentMatcher(command.args, pathNew);
            if (argumentMatcher.missing.length > 0) {
                return LookupResolver.createMissingArgsResult(pathNew, pathUsed, argumentMatcher.missing);
            }
            argumentsResolved = argumentMatcher.result;
            LookupResolver.logger.debug("Successfully looked up arguments: ", argumentsResolved);
        }
        return LookupResolver.createSuccessResult(pathNew, pathUsed, command, argumentsResolved);
    }
    resolveInternalSub(pathNew, pathUsed, command, argumentResolving) {
        LookupResolver.logger.debug("Resolving sub-commands:", command.sub, pathNew);
        return this.resolveInternal(command.sub.mapAliased, pathNew, pathUsed, argumentResolving);
    }
    hasCommand(commandMap, pathPart) {
        return commandMap.hasCommand(pathPart, this.caseSensitivity);
    }
}
LookupResolver.logger = clingyLogby.getLogger(LookupResolver);
export { LookupResolver };
//# sourceMappingURL=LookupResolver.js.map