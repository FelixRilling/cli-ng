import { isString } from "lightdash";

enum Level {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
    TRACE = 4
}

class Logger {
    private readonly name: string;
    private readonly instance: Logaloo;

    constructor(name: string, instance: Logaloo) {
        this.name = name;
        this.instance = instance;
    }

    public error(...args: any[]) {
        this.log(Level.ERROR, "ERROR", "error", args);
    }

    public warn(...args: any[]) {
        this.log(Level.WARN, "WARN", "warn", args);
    }

    public info(...args: any[]) {
        this.log(Level.INFO, "INFO", "info", args);
    }

    public debug(...args: any[]) {
        this.log(Level.DEBUG, "DEBUG", "log", args);
    }

    public trace(...args: any[]) {
        this.log(Level.TRACE, "TRACE", "log", args);
    }

    private log(
        levelValue: Level,
        levelName: string,
        outMethod: string,
        args: any
    ) {
        if (this.instance.level >= levelValue) {
            this.instance.stdout[outMethod](
                `${new Date().toISOString()} ${levelName} ${this.name} -`,
                ...args
            );
        }
    }
}

class Logaloo {
    public level: Level;
    public stdout: any;

    private readonly loggerMap = new Map<string, Logger>();

    /**
     * Creates a new logger module.
     *
     * @param level Level of this modules loggers.
     * @param stdout output stream to use, defaults to console
     */
    constructor(level: Level = Level.INFO, stdout: any = console) {
        this.level = level;
        this.stdout = stdout;
    }

    /**
     * Get a logger instance.
     *
     * @param nameable A string or a INameable (ex: class, function).
     * @returns The Logger instance.
     */
    public getLogger(nameable: any): Logger {
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

        const logger = new Logger(name, this);

        this.loggerMap.set(name, logger);

        return logger;
    }
}

export { Logaloo, Level, Logger };
