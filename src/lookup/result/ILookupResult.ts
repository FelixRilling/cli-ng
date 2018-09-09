import { commandPath } from "../../command/commandPath";

const enum ResultType {
    SUCCESS,
    ERROR_NOT_FOUND,
    ERROR_MISSING_ARGUMENT
}

interface ILookupResult {
    successful: boolean;
    pathUsed: commandPath;
    pathDangling: commandPath;
    type: ResultType;
}

export { ResultType, ILookupResult };
