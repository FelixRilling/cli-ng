import { Argument } from "../../argument/Argument";
import { LookupResult, ResultType } from "./LookupResult";

interface LookupErrorMissingArgs extends LookupResult {
    type: ResultType.ERROR_MISSING_ARGUMENT;
    missing: Argument[];
}

export { LookupErrorMissingArgs };
