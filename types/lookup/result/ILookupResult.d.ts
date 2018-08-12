import { commandPath } from "../../clingy";
declare const enum ResultType {
    SUCCESS = 0,
    ERROR_NOT_FOUND = 1,
    ERROR_MISSING_ARGUMENT = 2
}
interface ILookupResult {
    successful: boolean;
    pathUsed: commandPath;
    pathDangling: commandPath;
    type: ResultType;
}
export { ResultType, ILookupResult };
