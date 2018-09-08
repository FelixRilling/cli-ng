declare enum Level {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
    TRACE = 4
}
declare class Logger {
    private readonly name;
    private readonly instance;
    constructor(name: string, instance: Logaloo);
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    trace(...args: any[]): void;
    private log;
}
declare class Logaloo {
    level: Level;
    stdout: any;
    private readonly loggerMap;
    /**
     * Creates a new logger module.
     *
     * @param level Level of this modules loggers.
     * @param stdout output stream to use, defaults to console
     */
    constructor(level?: Level, stdout?: any);
    /**
     * Get a logger instance.
     *
     * @param nameable A string or a INameable (ex: class, function).
     * @returns The Logger instance.
     */
    getLogger(nameable: any): Logger;
}
export { Logaloo, Level, Logger };
