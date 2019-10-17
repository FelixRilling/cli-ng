import { CommandPath } from "../../command/CommandPath";

enum ResultType {
    SUCCESS,
    ERROR_NOT_FOUND,
    ERROR_MISSING_ARGUMENT
}

interface LookupResult {
    successful: boolean;
    pathUsed: CommandPath;
    pathDangling: CommandPath;
    type: ResultType;
}

export { ResultType, LookupResult };
