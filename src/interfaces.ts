interface IClingy {
    options: IClingyOptionsDefaulted;
    map: any;
    mapAliased: any;
    getCommand: (
        path: string[],
        pathUsed?: string[]
    ) => IClingyLookupSuccessful | IClingyLookupUnsuccessful;
}

interface IClingyLookupSuccessful {
    success: true;
    command: IClingyCommand;
    path: string[];
    pathDangling: string[];
    args?: { [key: string]: any; _all: string[] };
}

interface IClingyLookupUnsuccessful {
    success: false;
    error: {
        type: "missingCommand" | "missingArg";
        missing: string[];
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
    missing: string[];
}

interface IClingyCommand {
    name: string;
    fn: null;
    alias: string[];
    args: IClingyArg[];
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
    IClingyCommands,
    IClingyLookupSuccessful,
    IClingyLookupUnsuccessful
};
