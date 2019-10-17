import { ILookupResult, ResultType } from "./ILookupResult";
interface ILookupErrorNotFound extends ILookupResult {
    type: ResultType.ERROR_NOT_FOUND;
    missing: string;
    similar: string[];
}
export { ILookupErrorNotFound };
//# sourceMappingURL=ILookupErrorNotFound.d.ts.map