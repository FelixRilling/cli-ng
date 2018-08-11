import * as loglevel from "loglevel";
import {ILookupResult} from "./lookup/result/ILookupResult";
import {ICommand} from "./command/ICommand";
import {LookupResolver} from "./lookup/lookupResolver";
import {InputParser} from "./parser/inputParser";
import {CommandMap} from "./command/commandMap";

type commandPath = string[];

const Clingy = class {
    public readonly logger: loglevel.Logger = loglevel.getLogger("Clingy");
    public readonly lookupResolver: LookupResolver;
    public readonly inputParser: InputParser;
    public readonly map: CommandMap;
    public readonly mapAliased: CommandMap;

    constructor(
        commands: CommandMap = new CommandMap(),
        caseSensitive: boolean = true,
        legalQuotes: commandPath = ["\""]
    ) {
        this.lookupResolver = new LookupResolver(caseSensitive);
        this.inputParser = new InputParser(legalQuotes);
        this.map = commands;
        this.mapAliased = new CommandMap();
        this.updateAliases();
    }

    public setCommand(key: string, command: ICommand): void {
        this.map.set(key, command);
        this.updateAliases();
    }

    public getCommand(key: string): ICommand | undefined {
        return this.mapAliased.get(key);
    }

    public hasCommand(key: string): boolean {
        return this.mapAliased.has(key);
    }

    /**
     * Checks if a path resolves to a command.
     *
     * @param path Path to look up.
     * @return If the path resolves to a command.
     */
    public hasPath(path: commandPath): boolean {
        const lookupResult =
            this.getPath(path);

        return lookupResult != null && lookupResult.successful;
    }

    /**
     * Resolves a path to a command.
     *
     * @param path Path to look up.
     * @return Lookup result, either {@link ILookupSuccess} or {@link ILookupErrorNotFound}.
     */
    public getPath(path: commandPath): ILookupResult {
        this.logger.debug("Resolving path: {}", path);
        return this.lookupResolver.resolve(this.mapAliased, path);
    }

    /**
     * Parses a string into a command and arguments.
     *
     * @param input String to parse.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound} or {@link ILookupErrorMissingArgs}.
     */
    public parse(input: string): ILookupResult {
        this.logger.debug("Parsing input: '{}'", input);
        return this.lookupResolver.resolve(this.mapAliased, this.inputParser.parse(input), true);
    }

    public updateAliases() {

    }
};

export {Clingy, commandPath};
