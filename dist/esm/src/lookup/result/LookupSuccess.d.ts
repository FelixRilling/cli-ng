import { ResolvedArgumentMap } from "../../argument/ResolvedArgumentMap";
import { Command } from "../../command/Command";
import { LookupResult, ResultType } from "./LookupResult";
interface LookupSuccess extends LookupResult {
    type: ResultType.SUCCESS;
    command: Command;
    args: ResolvedArgumentMap;
}
export { LookupSuccess };
//# sourceMappingURL=LookupSuccess.d.ts.map