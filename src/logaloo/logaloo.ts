import { isString } from "lightdash";

type stdoutFn = (message?: any, ...optionalParams: any[]) => void;

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
const Level: ILevelList = {
    NONE: {
        val: -1
    },
    ERROR: {
        val: 0,
        name: "ERROR"
    },
    WARN: {
        val: 1,
        name: "WARN"
    },
    INFO: {
        val: 2,
        name: "INFO"
    },
    DEBUG: {
        val: 3,
        name: "DEBUG"
    },
    TRACE: {
        val: 4,
        name: "TRACE"
    }
};

/**
 * Logger class.
 */
class Logger implements ILogger {
    private readonly root: Logaloo;
    private readonly name: string;

    /**
     * Creates a new {@link Logger}.
     * Should not be constructed directly, rather use {@link Logaloo.getLogger}
     *
     * @param root Root logger of this logger.
     * @param name Name of the logger.
     */
    constructor(root: Logaloo, name: string) {
        this.root = root;
        this.name = name;
    }

    /**
     * Logs a message.
     *
     * @param level Level of the log.
     * @param args arguments to be logged.
     */
    log(level: ILevel, ...args: any[]) {
        if (this.root.level.val >= level.val) {
            this.root.outFn(
                `${new Date().toISOString()} ${level.name} ${this.name} - ${
                    args[0]
                    }`,
                ...args.slice(1)
            );
        }
    }

    /**
     * Logs an error.
     *
     * @param args arguments to be logged.
     */
    error(...args: any[]) {
        this.log(Level.ERROR, args);
    }

    /**
     * Logs a warning.
     *
     * @param args arguments to be logged.
     */
    warn(...args: any[]) {
        this.log(Level.WARN, args);
    }

    /**
     * Logs an info.
     *
     * @param args arguments to be logged.
     */
    info(...args: any[]) {
        this.log(Level.INFO, args);
    }

    /**
     * Logs a debug message.
     *
     * @param args arguments to be logged.
     */
    debug(...args: any[]) {
        this.log(Level.DEBUG, args);
    }

    /**
     * Logs a trace message.
     *
     * @param args arguments to be logged.
     */
    trace(...args: any[]) {
        this.log(Level.TRACE, args);
    }
}

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

export { Logaloo, Level, ILogger };
