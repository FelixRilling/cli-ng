import { IArgument } from "../argument/IArgument";
import { Clingy } from "../Clingy";

interface ICommand {
    alias: string[];
    fn: (...args: any[]) => void;
    args: IArgument[];
    data: any;
    sub: Clingy | null;
}

export { ICommand };
