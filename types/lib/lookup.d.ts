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
        type: missingErrorTypes.command;
        missing: string[];
        similar: string[];
    };
    path: string[];
}
interface IClingyLookupMissingArg {
    success: false;
    error: {
        type: missingErrorTypes.arg;
        missing: IClingyArg[];
    };
}
interface IClingyLookupArgs {
    [key: string]: string | string[];
    _all: string[];
}
declare const enum missingErrorTypes {
    command = "missingCommand",
    arg = "missingArg"
}
export { IClingyLookupArgs, IClingyLookupMissingArg, IClingyLookupMissingCommand, IClingyLookupSuccessful, missingErrorTypes };
