import {commandPath} from "../../clingy";

const enum ResultType {
    SUCCESS, ERROR_NOT_FOUND, ERROR_MISSING_ARGUMENT
}

interface ILookupResult {
    successful: boolean;
    path: commandPath;
    pathDangling: commandPath;
    type: ResultType;
}

export {ILookupResult, ResultType};
