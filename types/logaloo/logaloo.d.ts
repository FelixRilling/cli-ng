declare enum Level {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
    TRACE = 4
}
declare class Logger {
    private readonly name;
    constructor(name: string);
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    trace(...args: any[]): void;
}
declare const logaloo: {
    /**
     * Currently active logging level.
     */
    setLevel: (newLevel: Level) => void;
    /**
     * Get a logger instance.
     *
     * @param nameable A string or a INameable (ex: class, function).
     * @returns The Logger instance.
     */
    getLogger: (nameable: any) => Logger;
};
export { logaloo, Level, Logger };
