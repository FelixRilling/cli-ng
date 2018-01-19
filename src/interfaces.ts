interface IClingy {
    options: IClingyOptionsDefaulted;
    map: any;
    mapAliased: any;
    getAll(): {
        map: Map<string, IClingyCommand>;
        mapAliased: Map<string, IClingyCommand>;
    };
    getCommand(
        path: string[],
        pathUsed?: string[]
    ): IClingyLookupSuccessful | IClingyLookupUnsuccessful;
    parse(input: string): IClingyLookupSuccessful | IClingyLookupUnsuccessful;
}

interface IClingyLookupSuccessful {
    success: true;
    command: IClingyCommandProcessed;
    path: string[];
    pathDangling: string[];
    args?: { [key: string]: any; _all: string[] };
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

interface IClingyOptions {
    caseSensitive?: boolean;
    validQuotes?: string[];
}

interface IClingyOptionsDefaulted {
    caseSensitive: boolean;
    validQuotes: string[];
}

interface IClingyArg {
    name: string;
    required: true;
    default: null;
}

interface IClingyArgLookup {
    args: { [key: string]: any; _all: string[] };
    missing: IClingyArg[];
}

interface IClingyCommand {
    name: string;
    fn: null;
    alias: string[];
    args: IClingyArg[];
    sub: IClingyCommands | null;
}

interface IClingyCommandProcessed extends IClingyCommand {
    sub: IClingy | null;
}

interface IClingyCommands {
    [key: string]: IClingyCommand;
}

export {
    IClingy,
    IClingyOptions,
    IClingyOptionsDefaulted,
    IClingyArg,
    IClingyArgLookup,
    IClingyCommand,
    IClingyCommandProcessed,
    IClingyCommands,
    IClingyLookupSuccessful,
    IClingyLookupUnsuccessful
};
