import * as loglevel from "loglevel";
import {ILookupResult} from "./result/ILookupResult";

export class LookupResolver {
    private readonly logger: loglevel.Logger = loglevel.getLogger("LookupResolver");
    private readonly caseSensitive: boolean;

    constructor(caseSensitive: boolean = true) {
        this.caseSensitive = caseSensitive;
    }

    public resolve(mapAliased: CommandMap, path: commandPath): ILookupResult {
        return null;
    }
}
