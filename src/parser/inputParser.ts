import * as loglevel from "loglevel";

export class InputParser {
    private readonly logger: loglevel.Logger = loglevel.getLogger("LookupResolver");
    private readonly legalQuotes: string[];
    private readonly pattern: RegExp;

    constructor(legalQuotes: string[] = ["\""]) {
        this.legalQuotes = legalQuotes;
        this.generateMatcher();
    }

    public parse(input: string): string[] {
        return null;
    }

    private generateMatcher(): void {
        this.pattern = null;
    }
}
