import { IArgument } from "../argument/IArgument";
import { Clingy } from "../Clingy";
import { IObjWithCommands } from "./IObjWithCommands";
import { mapWithCommands } from "./mapWithCommands";
interface ICommand {
    alias: string[];
    fn: (...args: any[]) => void;
    args: IArgument[];
    data?: any;
    sub?: Clingy | mapWithCommands | IObjWithCommands | null;
}
export { ICommand };
