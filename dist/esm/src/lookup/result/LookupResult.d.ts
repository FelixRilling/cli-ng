import { CommandPath } from "../../command/CommandPath";
declare enum ResultType {
    SUCCESS = 0,
    ERROR_NOT_FOUND = 1,
    ERROR_MISSING_ARGUMENT = 2
}
interface LookupResult {
    successful: boolean;
    pathUsed: CommandPath;
    pathDangling: CommandPath;
    type: ResultType;
}
export { ResultType, LookupResult };
//# sourceMappingURL=LookupResult.d.ts.map