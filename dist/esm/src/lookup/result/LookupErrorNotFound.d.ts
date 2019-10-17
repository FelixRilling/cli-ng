import { LookupResult, ResultType } from "./LookupResult";
interface LookupErrorNotFound extends LookupResult {
    type: ResultType.ERROR_NOT_FOUND;
    missing: string;
    similar: string[];
}
export { LookupErrorNotFound };
//# sourceMappingURL=LookupErrorNotFound.d.ts.map