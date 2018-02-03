import { clingyCommandMap } from "./types";
interface IClingy {
    options: IClingyOptions;
    map: clingyCommandMap;
    mapAliased: clingyCommandMap;
    getAll(): {
        map: clingyCommandMap;
        mapAliased: clingyCommandMap;
    };
    getCommand(path: string[], pathUsed?: string[]): IClingyLookupSuccessful | IClingyLookupMissingCommand;
    parse(input: string): IClingyLookupSuccessful | IClingyLookupMissingCommand | IClingyLookupMissingArg;
}
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
interface IClingyOptions {
    caseSensitive: boolean;
    validQuotes: string[];
}
interface IClingyArg {
    [key: string]: any;
    name: string;
    required: boolean;
    default?: null;
}
interface IClingyCommand {
    [key: string]: any;
    fn: (...args: any[]) => any;
    alias: string[];
    args: IClingyArg[];
    sub: IClingyCommands | IClingy | null;
}
interface IClingyCommandProcessed extends IClingyCommand {
    name: string;
    sub: IClingy | null;
}
interface IClingyCommands {
    [key: string]: IClingyCommand;
}
export { IClingy, IClingyOptions, IClingyOptions, IClingyArg, IClingyCommand, IClingyLookupArgs, IClingyCommandProcessed, IClingyCommands, IClingyLookupSuccessful, IClingyLookupMissingCommand, IClingyLookupMissingArg };
