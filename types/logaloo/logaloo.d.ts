declare enum Levels {
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
    level: Levels;
    /**
     * Get a logger instance.
     *
     * @param name A string or a INameable (ex: class, function).
     * @returns The Logger instance.
     */
    getLogger: (name: any) => Logger;
};
export { logaloo, Levels, Logger };
