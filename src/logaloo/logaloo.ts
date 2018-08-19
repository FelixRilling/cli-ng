enum Levels {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
    TRACE = 4
}

// tslint:disable-next-line
let level: Levels = Levels.TRACE;
const stdout = console;

const getPrefix = (name: string, messageLevel: string): string =>
    `${new Date().toISOString()} ${messageLevel} ${name} -`;

class Logger {
    private readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    public error(...args: any[]) {
        if (level >= Levels.ERROR) {
            stdout.error(getPrefix(this.name, "ERROR"), ...args);
        }
    }

    public warn(...args: any[]) {
        if (level >= Levels.WARN) {
            stdout.warn(getPrefix(this.name, "WARN"), ...args);
        }
    }

    public info(...args: any[]) {
        if (level >= Levels.INFO) {
            stdout.info(getPrefix(this.name, "INFO"), ...args);
        }
    }

    public debug(...args: any[]) {
        if (level >= Levels.DEBUG) {
            stdout.log(getPrefix(this.name, "DEBUG"), ...args);
        }
    }

    public trace(...args: any[]) {
        if (level >= Levels.TRACE) {
            stdout.log(getPrefix(this.name, "TRACE"), ...args);
        }
    }
}

const logaloo = {
    /**
     * Currently active logging level.
     */
    level,
    /**
     * Get a logger instance.
     *
     * @param name A string or a INameable (ex: class, function).
     * @returns The Logger instance.
     */
    getLogger: (name: any) => new Logger("name" in name ? name.name : name)
};

export { logaloo, Levels, Logger };
