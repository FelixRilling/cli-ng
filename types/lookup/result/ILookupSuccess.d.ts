import { resolvedArgumentMap } from "../../argument/resolvedArgumentMap";
import { ICommand } from "../../command/ICommand";
import { ILookupResult, ResultType } from "./ILookupResult";
interface ILookupSuccess extends ILookupResult {
    type: ResultType.SUCCESS;
    command: ICommand;
    args: resolvedArgumentMap;
}
export { ILookupSuccess };
