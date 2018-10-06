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

/**
 * Lookup tools for resolving paths through {@link CommandMap}s.
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
            LookupResolver.logger.warn(
                `Command '${currentPathFragment}' could not be found.`
            );
            return <ILookupErrorNotFound>{
                successful: false,
                pathUsed,
                pathDangling: pathNew,
                type: ResultType.ERROR_NOT_FOUND,
                missing: currentPathFragment,
                similar: getSimilar(mapAliased, currentPathFragment)
            };
        }
        const command = <ICommand>(
            (this.caseSensitive
                ? mapAliased.get(currentPathFragment)
                : mapAliased.getIgnoreCase(currentPathFragment))
        );
        LookupResolver.logger.debug(
            `Successfully looked up command: ${currentPathFragment}`
        );

        if (pathNew.length > 0 && isInstanceOf(command.sub, Clingy)) {
            LookupResolver.logger.debug(
                `Resolving sub-commands: ${command.sub} ${pathNew}`
            );
            return this.resolveInternal(
                (<Clingy>command.sub).mapAliased,
                pathNew,
                pathUsed,
                parseArguments
            );
        }

        let argumentsResolved: resolvedArgumentMap;
        if (
            !parseArguments ||
            isNil(command.args) ||
            command.args.length === 0
        ) {
            LookupResolver.logger.debug(
                "No arguments defined, using empty list."
            );
            argumentsResolved = new Map();
        } else {
            LookupResolver.logger.debug(`Looking up arguments: ${pathNew}`);
            const argumentMatcher = new ArgumentMatcher(command.args, pathNew);

            if (argumentMatcher.missing.length > 0) {
                LookupResolver.logger.warn(
                    `Some arguments could not be found: ${argumentMatcher.missing.map(
                        arg => arg.name
                    )}`
                );

                return <ILookupErrorMissingArgs>{
                    successful: false,
                    pathUsed,
                    pathDangling: pathNew,
                    type: ResultType.ERROR_MISSING_ARGUMENT,
                    missing: argumentMatcher.missing
                };
            }

            argumentsResolved = argumentMatcher.result;
            LookupResolver.logger.debug(
                `Successfully looked up arguments: ${argumentsResolved}`
            );
        }

        const lookupSuccess = <ILookupSuccess>{
            successful: true,
            pathUsed,
            pathDangling: pathNew,
            type: ResultType.SUCCESS,
            command,
            args: argumentsResolved
        };
        LookupResolver.logger.debug(
            `Returning successful lookup result: ${lookupSuccess}`
        );

        return lookupSuccess;
    }
}

export { LookupResolver };
