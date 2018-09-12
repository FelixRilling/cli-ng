import { ILevelList } from "./ILevelList";

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

export { Level };
