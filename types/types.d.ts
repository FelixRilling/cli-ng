import { IClingyCommand } from "./interfaces";
declare type clingyCommandEntry = [string, IClingyCommand];
declare type clingyCommandEntries = clingyCommandEntry[];
declare type clingyCommandMap = Map<string, IClingyCommand>;
export { clingyCommandEntry, clingyCommandEntries, clingyCommandMap };
