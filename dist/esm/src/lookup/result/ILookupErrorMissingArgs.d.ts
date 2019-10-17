import { IArgument } from "../../argument/IArgument";
import { ILookupResult, ResultType } from "./ILookupResult";
interface ILookupErrorMissingArgs extends ILookupResult {
    type: ResultType.ERROR_MISSING_ARGUMENT;
    missing: IArgument[];
}
export { ILookupErrorMissingArgs };
//# sourceMappingURL=ILookupErrorMissingArgs.d.ts.map