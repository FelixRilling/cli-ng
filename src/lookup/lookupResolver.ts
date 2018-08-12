import * as loglevel from "loglevel";
import {ILookupResult, ResultType} from "./result/ILookupResult";
import {CommandMap} from "../command/commandMap";
import {commandPath} from "../clingy";
import {getSimilar} from "../command/util/commandUtil";
import {ArgumentMatcher, resolvedArgumentMap} from "../argument/argumentMatcher";
import {isNil} from "lightdash";
import {ICommand} from "../command/ICommand";
import {ILookupErrorMissingArgs} from "./result/ILookupErrorMissingArgs";
import {ILookupErrorNotFound} from "./result/ILookupErrorNotFound";
import {ILookupSuccess} from "./result/ILookupSuccess";

class LookupResolver {
    private readonly logger: loglevel.Logger = loglevel.getLogger("LookupResolver");
    private readonly caseSensitive: boolean;

    constructor(caseSensitive: boolean = true) {
        this.caseSensitive = caseSensitive;
    }

    /**
     * Resolves a path through a {@link CommandMap}.
     *
     * @param mapAliased     Map to use.
     * @param path           Path to getPath.
     * @param parseArguments If dangling path items should be treated as arguments.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    public resolve(mapAliased: CommandMap, path: commandPath, parseArguments: boolean = false): ILookupResult | null {
        return this.resolveInternal(mapAliased, path, [], parseArguments);
    }

    private resolveInternal(mapAliased: CommandMap, path: commandPath, pathUsed: commandPath, parseArguments: boolean = false): ILookupResult | null {
        if (path.length === 0) {
            this.logger.info("Empty path was given, returning early.");
            return null;
        }

        const currentPathFragment = path[0];

        if (this.caseSensitive ?
            !mapAliased.has(currentPathFragment) :
            !mapAliased.hasIgnoreCase(currentPathFragment)) {
            this.logger.warn("Command '{}' could not be found.", currentPathFragment);

            return <ILookupErrorNotFound>{
                successful: false,
                path: pathUsed,
                pathDangling: path,
                type: ResultType.ERROR_NOT_FOUND,
                missing: currentPathFragment,
                similar: getSimilar(mapAliased, currentPathFragment)
            };
        }

        const command = <ICommand>(this.caseSensitive ?
            mapAliased.get(currentPathFragment) :
            mapAliased.getIgnoreCase(currentPathFragment));
        const pathNew = path.slice(1);
        pathUsed.push(currentPathFragment);
        this.logger.debug("Successfully looked up command: {}", currentPathFragment);

        let argumentsResolved: resolvedArgumentMap;
        if (isNil(command.args) || command.args.length === 0) {
            this.logger.debug("No arguments defined, using empty list.");
            argumentsResolved = new Map();
        } else {
            this.logger.debug("Looking up arguments: {}", pathNew);
            const argumentMatcher = new ArgumentMatcher(command.args, pathNew);


            if (argumentMatcher.missing.length > 0) {
                this.logger.warn("Some arguments could not be found: {}", argumentMatcher.missing);

                return <ILookupErrorMissingArgs>{
                    successful: false,
                    path: pathUsed,
                    pathDangling: path,
                    type: ResultType.ERROR_MISSING_ARGUMENT,
                    missing: argumentMatcher.missing
                };
            }

            argumentsResolved = argumentMatcher.result;
            this.logger.debug("Successfully looked up arguments: {}", argumentsResolved);

        }

        const lookupSuccess = <ILookupSuccess>{
            successful: true,
            path: pathUsed,
            pathDangling: path,
            type: ResultType.SUCCESS,
            command,
            args: argumentsResolved
        };
        this.logger.debug("Returning successful lookup result: {}", lookupSuccess);

        return lookupSuccess;
    }
}

export {LookupResolver};
