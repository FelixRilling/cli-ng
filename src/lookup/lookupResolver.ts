import * as loglevel from "loglevel";
import {ILookupResult} from "./result/ILookupResult";
import {CommandMap} from "../command/commandMap";
import {commandPath} from "../clingy";

export class LookupResolver {
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
     * @return Lookup result, either {@link LookupSuccess}, {@link LookupErrorNotFound} or {@link LookupErrorMissingArgs}.
     */
    public resolve(mapAliased: CommandMap, path: commandPath, parseArguments: boolean = false): ILookupResult {
        return null;
    }
}
