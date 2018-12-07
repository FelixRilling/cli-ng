import { isInstanceOf, isNil } from "lightdash";
import { ArgumentMatcher } from "../argument/ArgumentMatcher";
import { resolvedArgumentMap } from "../argument/resolvedArgumentMap";
import { Clingy } from "../Clingy";
import { CommandMap } from "../command/CommandMap";
import { commandPath } from "../command/commandPath";
import { ICommand } from "../command/ICommand";
import { getSimilar } from "../command/util/commandUtil";
import { clingyLogby } from "../logger";
import { ILookupErrorMissingArgs } from "./result/ILookupErrorMissingArgs";
import { ILookupErrorNotFound } from "./result/ILookupErrorNotFound";
import { ILookupResult, ResultType } from "./result/ILookupResult";
import { ILookupSuccess } from "./result/ILookupSuccess";
import { IArgument } from "../argument/IArgument";

/**
 * Lookup tools for resolving paths through {@link CommandMap}s.
 *
 * @private
 */
class LookupResolver {
    private static readonly logger = clingyLogby.getLogger(LookupResolver);

    private readonly caseSensitive: boolean;

    /**
     * Creates a new {@link LookupResolver}.
     *
     * @param caseSensitive If the lookup should honor case.
     */
    constructor(caseSensitive: boolean = true) {
        this.caseSensitive = caseSensitive;
    }

    /**
     * Resolves a pathUsed through a {@link CommandMap}.
     *
     * @param mapAliased     Map to use.
     * @param path           Path to getPath.
     * @param parseArguments If dangling pathUsed items should be treated as arguments.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    public resolve(
        mapAliased: CommandMap,
        path: commandPath,
        parseArguments: boolean = false
    ): ILookupResult {
        if (path.length === 0) {
            throw new Error("Path cannot be empty.");
        }

        return this.resolveInternal(mapAliased, path, [], parseArguments);
    }

    private static createSuccessResult(
        pathNew: commandPath,
        pathUsed: commandPath,
        command: ICommand,
        args: resolvedArgumentMap
    ): ILookupSuccess {
        const lookupSuccess: ILookupSuccess = {
            successful: true,
            pathUsed,
            pathDangling: pathNew,
            type: ResultType.SUCCESS,
            command,
            args
        };
        LookupResolver.logger.debug(
            "Returning successful lookup result:",
            lookupSuccess
        );
        return lookupSuccess;
    }

    private static createNotFoundResult(
        pathNew: commandPath,
        pathUsed: commandPath,
        currentPathFragment: string,
        commandMap: CommandMap
    ): ILookupErrorNotFound {
        LookupResolver.logger.warn(
            `Command '${currentPathFragment}' could not be found.`
        );
        return <ILookupErrorNotFound>{
            successful: false,
            pathUsed,
            pathDangling: pathNew,
            type: ResultType.ERROR_NOT_FOUND,
            missing: currentPathFragment,
            similar: getSimilar(commandMap, currentPathFragment)
        };
    }

    private static createMissingArgsResult(
        pathNew: commandPath,
        pathUsed: commandPath,
        missing: IArgument[]
    ): ILookupErrorMissingArgs {
        LookupResolver.logger.warn(
            "Some arguments could not be found:",
            missing
        );

        return <ILookupErrorMissingArgs>{
            successful: false,
            pathUsed,
            pathDangling: pathNew,
            type: ResultType.ERROR_MISSING_ARGUMENT,
            missing
        };
    }

    private resolveInternal(
        mapAliased: CommandMap,
        path: commandPath,
        pathUsed: commandPath,
        parseArguments: boolean
    ): ILookupResult {
        const currentPathFragment = path[0];
        const pathNew = path.slice(1);
        pathUsed.push(currentPathFragment);

        if (
            this.caseSensitive
                ? !mapAliased.has(currentPathFragment)
                : !mapAliased.hasIgnoreCase(currentPathFragment)
        ) {
            return LookupResolver.createNotFoundResult(
                pathNew,
                pathUsed,
                currentPathFragment,
                mapAliased
            );
        }

        const command = <ICommand>(
            (this.caseSensitive
                ? mapAliased.get(currentPathFragment)
                : mapAliased.getIgnoreCase(currentPathFragment))
        );
        LookupResolver.logger.debug(
            `Successfully looked up command: ${currentPathFragment}`
        );

        let argumentsResolved: resolvedArgumentMap;
        if (
            !parseArguments ||
            isNil(command.args) ||
            command.args.length === 0
        ) {
            if (pathNew.length > 0 && isInstanceOf(command.sub, Clingy)) {
                return this.resolveInternalSub(
                    pathNew,
                    pathUsed,
                    command,
                    parseArguments
                );
            }

            LookupResolver.logger.debug(
                "No arguments defined, using empty map."
            );
            argumentsResolved = new Map();
        } else {
            LookupResolver.logger.debug(`Looking up arguments: ${pathNew}`);
            const argumentMatcher = new ArgumentMatcher(command.args, pathNew);

            if (argumentMatcher.missing.length > 0) {
                return LookupResolver.createMissingArgsResult(pathNew, pathUsed, argumentMatcher.missing);
            }

            argumentsResolved = argumentMatcher.result;
            LookupResolver.logger.debug(
                "Successfully looked up arguments:",
                argumentsResolved
            );
        }

        return LookupResolver.createSuccessResult(
            pathNew,
            pathUsed,
            command,
            argumentsResolved
        );
    }

    private resolveInternalSub(
        pathNew: commandPath,
        pathUsed: commandPath,
        command: ICommand,
        parseArguments: boolean
    ) {
        LookupResolver.logger.debug(
            "Resolving sub-commands:",
            command.sub,
            pathNew
        );
        return this.resolveInternal(
            (<Clingy>command.sub).mapAliased,
            pathNew,
            pathUsed,
            parseArguments
        );
    }
}

export { LookupResolver };
