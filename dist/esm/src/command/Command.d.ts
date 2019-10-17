import { Argument } from "../argument/Argument";
import { Clingy } from "../Clingy";
import { MapWithCommands } from "./MapWithCommands";
import { ObjWithCommands } from "./ObjWithCommands";
interface Command {
    alias: string[];
    fn: (...args: any[]) => void;
    args: Argument[];
    data?: any;
    sub?: Clingy | MapWithCommands | ObjWithCommands | null;
}
export { Command };
//# sourceMappingURL=Command.d.ts.map