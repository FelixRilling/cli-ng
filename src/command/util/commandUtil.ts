import {CommandMap} from "../commandMap";
import {strSimilar} from "lightdash";

const getSimilar = (mapAliased: CommandMap, name: string): string[] =>
    <string[]>strSimilar(name, Array.from(mapAliased.keys()), false);

export {getSimilar};
