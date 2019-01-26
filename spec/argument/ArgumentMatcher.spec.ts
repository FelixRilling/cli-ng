import { ArgumentMatcher } from "../../src/argument/ArgumentMatcher";
import { IArgument } from "../../src/argument/IArgument";

/**
 * Tests for {@link ArgumentMatcher}.
 */
describe("ArgumentMatcher", () => {
    it("Asserts that ArgumentMatcher works with an empty list.", () => {
        const argumentMatcher = new ArgumentMatcher([], []);

        expect(argumentMatcher.result).toEqual(new Map());
        expect(argumentMatcher.missing).toEqual([]);
    });

    it("Asserts that ArgumentMatcher collects found arguments.", () => {
        const provided = "bar";
        const expected = "foo";
        const expectedArg: IArgument = { name: expected, required: true };
        const argumentMatcher = new ArgumentMatcher([expectedArg], [provided]);

        expect(argumentMatcher.result).toEqual(new Map([[expected, provided]]));
        expect(argumentMatcher.missing).toEqual([]);
    });

    it("Asserts that ArgumentMatcher ignores trailing arguments.", () => {
        const provided = "bar";
        const expected = "foo";
        const expectedArg: IArgument = { name: expected, required: true };
        const argumentMatcher = new ArgumentMatcher(
            [expectedArg],
            [provided, "fizz", "buzz"]
        );

        expect(argumentMatcher.result).toEqual(new Map([[expected, provided]]));
        expect(argumentMatcher.missing).toEqual([]);
    });

    it("Asserts that ArgumentMatcher falls back for optional arguments.", () => {
        const value = "bar";
        const expected = "foo";
        const expectedArg: IArgument = {
            name: expected,
            required: false,
            defaultValue: value
        };
        const argumentMatcher = new ArgumentMatcher([expectedArg], []);

        expect(argumentMatcher.result).toEqual(new Map([[expected, value]]));
        expect(argumentMatcher.missing).toEqual([]);
    });

    it("Asserts that ArgumentMatcher does set optional arguments that have no default value as null.", () => {
        const expected = "foo";
        const expectedArg: IArgument = {
            name: expected,
            required: false
        };
        const argumentMatcher = new ArgumentMatcher([expectedArg], []);

        expect(argumentMatcher.result).toEqual(new Map([[expected, null]]));
        expect(argumentMatcher.missing).toEqual([]);
    });

    it("Asserts that ArgumentMatcher collects missing arguments.", () => {
        const expected = "foo";
        const expectedArg: IArgument = { name: expected, required: true };
        const argumentMatcher = new ArgumentMatcher([expectedArg], []);

        expect(argumentMatcher.result).toEqual(new Map());
        expect(argumentMatcher.missing).toEqual([expectedArg]);
    });
});
