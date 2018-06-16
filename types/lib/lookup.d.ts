import { IClingyArg } from "./arg";
import { IClingyCommand } from "./command";
interface IClingyLookupSuccessful {
    success: true;
    command: IClingyCommand;
    path: string[];
    pathDangling: string[];
    args?: IClingyLookupArgs;
}
interface IClingyLookupMissingCommand {
    success: false;
    error: {
        type: "missingCommand";
        missing: string[];
        similar: string[];
    };
    path: string[];
}
interface IClingyLookupMissingArg {
    success: false;
    error: {
        type: "missingArg";
        missing: IClingyArg[];
    };
}
interface IClingyLookupArgs {
    [key: string]: string | string[];
    _all: string[];
}
export { IClingyLookupArgs, IClingyLookupMissingArg, IClingyLookupMissingCommand, IClingyLookupSuccessful };
