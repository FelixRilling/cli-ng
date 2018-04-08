import { IClingyCommand } from "./interfaces";

type clingyCommandEntry = [string, IClingyCommand];

type clingyCommandEntries = clingyCommandEntry[];

type clingyCommandMap = Map<string, IClingyCommand>;

export { clingyCommandEntry, clingyCommandEntries, clingyCommandMap };
