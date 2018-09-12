import { stdoutFn } from "./logger/stdoutFn";
import { ILevel } from "./level/ILevel";
import { ILogger } from "./logger/ILogger";
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
export { Logaloo };
