import { isString } from "lightdash";
import { stdoutFn } from "./logger/stdoutFn";
import { ILevel } from "./level/ILevel";
import { ILogger } from "./logger/ILogger";
import { Level } from "./level/Level";
import { Logger } from "./logger/Logger";

/**
 * Logger-root class.
 */
class Logaloo {
    public level: ILevel;
    public outFn: stdoutFn;

    private readonly loggerMap = new Map<string, ILogger>();

    /**
     * Creates a new logger module.
     *
     * @param level Level of this logger-root loggers.
     * @param outFn output function to use, defaults to console.log
     */
    constructor(level: ILevel = Level.INFO, outFn: stdoutFn = console.log) {
        this.level = level;
        this.outFn = outFn;
    }

    /**
     * Get a logger instance.
     *
     * @param nameable A string or an INameable (ex: class, function).
     * @returns The Logger instance.
     */
    public getLogger(nameable: any): ILogger {
        let name: string;

        if ("name" in nameable) {
            name = nameable.name;
        } else if (isString(nameable)) {
            name = nameable;
        } else {
            throw new TypeError(
                `'${nameable}' is neither an INameable nor a string.`
            );
        }

        if (this.loggerMap.has(name)) {
            return <Logger>this.loggerMap.get(name);
        }

        const logger = new Logger(this, name);
        this.loggerMap.set(name, logger);

        return logger;
    }
}

export { Logaloo };
