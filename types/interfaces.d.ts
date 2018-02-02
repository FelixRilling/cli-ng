import { clingyCommandMap } from "./types";
interface IClingy {
    options: IClingyOptionsDefaulted;
    map: clingyCommandMap;
    mapAliased: clingyCommandMap;
    getAll(): {
        map: clingyCommandMap;
        mapAliased: clingyCommandMap;
    };
    getCommand(path: string[], pathUsed?: string[]): IClingyLookupSuccessful | IClingyLookupUnsuccessful;
    parse(input: string): IClingyLookupSuccessful | IClingyLookupUnsuccessful;
}
interface IClingyLookupSuccessful {
    success: true;
    command: IClingyCommand;
    path: string[];
    pathDangling: string[];
    args?: IClingyLookupArgs;
}
interface IClingyLookupUnsuccessful {
    success: false;
    error: {
        type: "missingCommand" | "missingArg";
        missing: string[] | IClingyArg[];
        similar?: string[];
    };
    path?: string[];
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
    name: string;
    required: true;
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
export { IClingy, IClingyOptions, IClingyOptionsDefaulted, IClingyArg, IClingyCommand, IClingyLookupArgs, IClingyCommandProcessed, IClingyCommands, IClingyLookupSuccessful, IClingyLookupUnsuccessful };
