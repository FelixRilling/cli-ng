import {Clingy} from "../src/main";
import {isInstanceOf} from "lightdash";

describe("Init", () => {
    const cli = new Clingy({
        myCommand: {
            fn: () => "About",
            args: [],
            alias: ["why", "?"]
        },
        nested: {
            fn: () => 1,
            args: [],
            alias: [],
            sub: new Clingy({
                nested2: {
                    fn: () => 4,
                    alias: ["nestedMore"],
                    args: [],
                    sub: new Clingy({
                        nested3: {fn: () => 5, alias: ["nestedEvenMore"], args: []}
                    })
                }
            })
        }
    });

    it("Main", () => {
        expect(() => isInstanceOf(cli, Clingy)).toBeTruthy();
    });
});
