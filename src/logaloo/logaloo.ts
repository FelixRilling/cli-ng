import { isString } from "lightdash";

enum Level {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
    TRACE = 4
}

// tslint:disable-next-line
let level: Level = Level.TRACE;

const getPrefix = (name: string, messageLevel: string): string =>
    `${new Date().toISOString()} ${messageLevel} ${name} -`;

class Logger {
    private readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    public error(...args: any[]) {
        if (level >= Level.ERROR) {
            // tslint:disable-next-line
            console.error(getPrefix(this.name, "ERROR"), ...args);
        }
    }

    public warn(...args: any[]) {
        if (level >= Level.WARN) {
            // tslint:disable-next-line
            console.warn(getPrefix(this.name, "WARN"), ...args);
        }
    }

    public info(...args: any[]) {
        if (level >= Level.INFO) {
            // tslint:disable-next-line
            console.info(getPrefix(this.name, "INFO"), ...args);
        }
    }

    public debug(...args: any[]) {
        if (level >= Level.DEBUG) {
            // tslint:disable-next-line
            console.log(getPrefix(this.name, "DEBUG"), ...args);
        }
    }

    public trace(...args: any[]) {
        if (level >= Level.TRACE) {
            // tslint:disable-next-line
            console.log(getPrefix(this.name, "TRACE"), ...args);
        }
    }
}

const loggerMap = new Map<string, Logger>();

const logaloo = {
    /**
     * Currently active logging level.
     */
    setLevel: (newLevel: Level): void => {
        level = newLevel;
    },
    /**
     * Get a logger instance.
     *
     * @param nameable A string or a INameable (ex: class, function).
     * @returns The Logger instance.
     */
    getLogger: (nameable: any): Logger => {
        let name: string;

        if ("name" in nameable) {
            name = nameable.name;
        } else if (isString(nameable)) {
            name = nameable;
        } else {
            throw new TypeError(
                `'${nameable}' is neither an INameable or a string.`
            );
        }

        if (loggerMap.has(name)) {
            return <Logger>loggerMap.get(name);
        }

        const logger = new Logger(name);

        loggerMap.set(name, logger);

        return logger;
    }
};

export { logaloo, Level, Logger };
