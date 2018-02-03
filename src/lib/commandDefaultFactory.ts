import { IClingyCommand } from "../interfaces";

/**
 * Default command structure
 *
 * @private
 * @param {Object} arg
 * @param {number} index
 * @returns {Object}
 */
const commandDefaultFactory = (index: number): IClingyCommand => {
    return {
        name: `command${index}`,
        fn: () => { },
        alias: [],
        args: [],
        sub: null
    };
};

export default commandDefaultFactory;
