import { IClingyArg } from "../interfaces";

/**
 * Default argument structure
 *
 * @private
 * @param {Object} arg
 * @param {number} index
 * @returns {Object}
 */
const argDefaultFactory = (index: number): IClingyArg => {
    return {
        name: `arg${index}`,
        required: true,
        default: null
    };
};

export { argDefaultFactory };
