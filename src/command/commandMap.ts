import {ICommand} from "./ICommand";

class CommandMap extends Map<string, ICommand> {
    public hasIgnoreCase(key: string): boolean {
        return true;
    }

    public getIgnoreCase(key: string): ICommand | null {
        return null;
    }
}


export {CommandMap};
