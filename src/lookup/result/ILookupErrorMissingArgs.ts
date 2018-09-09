import { ILookupResult, ResultType } from "./ILookupResult";
import { IArgument } from "../../argument/IArgument";

interface ILookupErrorMissingArgs extends ILookupResult {
    type: ResultType.ERROR_MISSING_ARGUMENT;
    missing: IArgument[];
}

export { ILookupErrorMissingArgs };
