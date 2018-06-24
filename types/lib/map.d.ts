import { IClingyCommand } from "./command";
declare type clingyCommandMap = Map<string, IClingyCommand>;
/**
 * Creates an aliased map from a normal map.
 *
 * @private
 * @param {Map} map command map to alias.
 * @returns {Map} aliased command map.
 */
declare const getAliasedMap: (map: Map<string, IClingyCommand>) => Map<string, IClingyCommand>;
export { getAliasedMap, clingyCommandMap };
