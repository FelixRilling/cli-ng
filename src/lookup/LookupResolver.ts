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
import { ArgumentResolving } from "./ArgumentResolving";
import { CaseSensitivity } from "./CaseSensitivity";

/**
 * Lookup tools for resolving paths through {@link CommandMap}s.
 *
 * @private
 */
class LookupResolver {
    private static readonly logger = clingyLogby.getLogger(LookupResolver);

    private readonly caseSensitivity: CaseSensitivity;

    /**
     * Creates a new {@link LookupResolver}.
     *
     * @param caseSensitive If the lookup should honor case.
     */
    constructor(caseSensitive: boolean = true) {
        this.caseSensitivity = caseSensitive
            ? CaseSensitivity.SENSITIVE
            : CaseSensitivity.INSENSITIVE;
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

    /**
     * Resolves a pathUsed through a {@link CommandMap}.
     *
     * @param commandMap        Map to use.
     * @param path              Path to getPath.
     * @param argumentResolving Strategy for resolving arguments.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    public resolve(
        commandMap: CommandMap,
        path: commandPath,
        argumentResolving: ArgumentResolving
    ): ILookupResult {
        if (path.length === 0) {
            throw new Error("Path cannot be empty.");
        }

        return this.resolveInternal(commandMap, path, [], argumentResolving);
    }

    private resolveInternal(
        commandMap: CommandMap,
        path: commandPath,
        pathUsed: commandPath,
        argumentResolving: ArgumentResolving
    ): ILookupResult {
        const currentPathFragment = path[0];
        const pathNew = path.slice(1);
        pathUsed.push(currentPathFragment);

        if (!commandMap.hasCommand(currentPathFragment, this.caseSensitivity)) {
            return LookupResolver.createNotFoundResult(
                pathNew,
                pathUsed,
                currentPathFragment,
                commandMap
            );
        }
        // We already checked if the key exists, assert its existence it.
        const command = <ICommand>(
            commandMap.getCommand(currentPathFragment, this.caseSensitivity)
        );
        LookupResolver.logger.debug(
            `Successfully looked up command: ${currentPathFragment}`
        );

        if (pathNew.length > 0 && isInstanceOf(command.sub, Clingy)) {
            const subResult = this.resolveInternalSub(
                pathNew,
                pathUsed,
                command,
                argumentResolving
            );

            if (subResult.successful) {
                return subResult;
            }
        }

        let argumentsResolved: resolvedArgumentMap;
        if (
            argumentResolving === ArgumentResolving.IGNORE ||
            isNil(command.args) ||
            command.args.length === 0
        ) {
            LookupResolver.logger.debug(
                "No arguments defined, using empty map."
            );
            argumentsResolved = new Map();
        } else {
            LookupResolver.logger.debug(`Looking up arguments: ${pathNew}`);
            const argumentMatcher = new ArgumentMatcher(command.args, pathNew);

            if (argumentMatcher.missing.length > 0) {
                return LookupResolver.createMissingArgsResult(
                    pathNew,
                    pathUsed,
                    argumentMatcher.missing
                );
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
        argumentResolving: ArgumentResolving
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
            argumentResolving
        );
    }
}

export { LookupResolver };
