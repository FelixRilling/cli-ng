import { IClingyCommand } from "../interfaces";
/**
 * Default command structure
 *
 * @private
 * @param {Object} arg
 * @param {number} index
 * @returns {Object}
 */
declare const commandDefaultFactory: (index: number) => IClingyCommand;
export { commandDefaultFactory };
