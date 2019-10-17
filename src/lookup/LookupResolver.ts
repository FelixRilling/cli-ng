import { isNil } from "lodash";
import { Argument } from "../argument/Argument";
import { ArgumentMatcher } from "../argument/ArgumentMatcher";
import { ResolvedArgumentMap } from "../argument/ResolvedArgumentMap";
import { Clingy } from "../Clingy";
import { Command } from "../command/Command";
import { CommandMap } from "../command/CommandMap";
import { CommandPath } from "../command/CommandPath";
import { getSimilar } from "../command/util/commandUtil";
import { clingyLogby } from "../logger";
import { ArgumentResolving } from "./ArgumentResolving";
import { CaseSensitivity } from "./CaseSensitivity";
import { LookupErrorMissingArgs } from "./result/LookupErrorMissingArgs";
import { LookupErrorNotFound } from "./result/LookupErrorNotFound";
import { LookupResult, ResultType } from "./result/LookupResult";
import { LookupSuccess } from "./result/LookupSuccess";

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
    public constructor(caseSensitive = true) {
        this.caseSensitivity = caseSensitive
            ? CaseSensitivity.SENSITIVE
            : CaseSensitivity.INSENSITIVE;
    }

    private static createSuccessResult(
        pathNew: CommandPath,
        pathUsed: CommandPath,
        command: Command,
        args: ResolvedArgumentMap
    ): LookupSuccess {
        const lookupSuccess: LookupSuccess = {
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
        pathNew: CommandPath,
        pathUsed: CommandPath,
        currentPathFragment: string,
        commandMap: CommandMap
    ): LookupErrorNotFound {
        LookupResolver.logger.warn(
            `Command '${currentPathFragment}' could not be found.`
        );
        return <LookupErrorNotFound>{
            successful: false,
            pathUsed,
            pathDangling: pathNew,
            type: ResultType.ERROR_NOT_FOUND,
            missing: currentPathFragment,
            similar: getSimilar(commandMap, currentPathFragment)
        };
    }

    private static createMissingArgsResult(
        pathNew: CommandPath,
        pathUsed: CommandPath,
        missing: Argument[]
    ): LookupErrorMissingArgs {
        LookupResolver.logger.warn(
            "Some arguments could not be found:",
            missing
        );

        return <LookupErrorMissingArgs>{
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
     * @return Lookup result, either {@link LookupSuccess}, {@link LookupErrorNotFound}
     * or {@link LookupErrorMissingArgs}.
     */
    public resolve(
        commandMap: CommandMap,
        path: CommandPath,
        argumentResolving: ArgumentResolving
    ): LookupResult {
        if (path.length === 0) {
            throw new Error("Path cannot be empty.");
        }

        return this.resolveInternal(commandMap, path, [], argumentResolving);
    }

    private resolveInternal(
        commandMap: CommandMap,
        path: CommandPath,
        pathUsed: CommandPath,
        argumentResolving: ArgumentResolving
    ): LookupResult {
        const currentPathFragment = path[0];
        const pathNew = path.slice(1);
        pathUsed.push(currentPathFragment);

        if (!this.hasCommand(commandMap, currentPathFragment)) {
            return LookupResolver.createNotFoundResult(
                pathNew,
                pathUsed,
                currentPathFragment,
                commandMap
            );
        }
        // We already checked if the key exists, assert its existence.
        const command = <Command>(
            commandMap.getCommand(currentPathFragment, this.caseSensitivity)
        );
        LookupResolver.logger.debug(`Found command: '${currentPathFragment}'.`);

        /*
         * Recurse into sub-commands if:
         * Additional items are in the path AND
         * the current command has sub-commands AND
         * the sub-commands contain the next path item.
         */
        if (
            pathNew.length > 0 &&
            command.sub instanceof Clingy &&
            this.hasCommand(command.sub.mapAliased, pathNew[0])
        ) {
            return this.resolveInternalSub(
                pathNew,
                pathUsed,
                command,
                argumentResolving
            );
        }

        /*
         * Skip checking for arguments if:
         * The parameter argumentResolving is set to ignore arguments OR
         * the command has no arguments defined OR
         * the command has an empty array defined as arguments.
         */
        let argumentsResolved: ResolvedArgumentMap;
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
            LookupResolver.logger.debug(`Looking up arguments: '${pathNew}'.`);
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
                "Successfully looked up arguments: ",
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
        pathNew: CommandPath,
        pathUsed: CommandPath,
        command: Command,
        argumentResolving: ArgumentResolving
    ): LookupResult {
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

    private hasCommand(commandMap: CommandMap, pathPart: string): boolean {
        return commandMap.hasCommand(pathPart, this.caseSensitivity);
    }
}

export { LookupResolver };
