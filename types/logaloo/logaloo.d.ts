declare type stdoutFn = (message?: any, ...optionalParams: any[]) => void;
interface ILevel {
    val: number;
    name?: string;
}
interface ILevelList {
    [key: string]: ILevel;
}
interface ILogger {
    log(level: ILevel, ...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    trace(...args: any[]): void;
}
/**
 * Default level-list.
 */
declare const Level: ILevelList;
/**
 * Logger-root class.
 */
declare class Logaloo {
    level: ILevel;
    outFn: stdoutFn;
    private readonly loggerMap;
    /**
     * Creates a new logger module.
     *
     * @param level Level of this logger-root loggers.
     * @param outFn output function to use, defaults to console.log
     */
    constructor(level?: ILevel, outFn?: stdoutFn);
    /**
     * Get a logger instance.
     *
     * @param nameable A string or an INameable (ex: class, function).
     * @returns The Logger instance.
     */
    getLogger(nameable: any): ILogger;
}
export { Logaloo, Level, ILogger };
