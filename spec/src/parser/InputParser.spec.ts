import { isRegExp } from "lodash";
import { InputParser } from "../../../src/parser/InputParser";

/**
 * Tests for {@link InputParser}.
 */
describe("InputParser", () => {
    it("Asserts that InputParser creates a matcher pattern.", () => {
        expect(isRegExp(new InputParser().pattern)).toBeTruthy();
    });

    it("Asserts that InputParser escapes special regex characters.", () => {
        expect(isRegExp(new InputParser(["?", "$", "("]).pattern)).toBeTruthy();
    });

    it("Asserts that InputParser splits spaces from the input.", () => {
        const inputParser = new InputParser();

        expect(inputParser.parse("foo")).toEqual(["foo"]);
        expect(inputParser.parse("foo bar")).toEqual(["foo", "bar"]);
        expect(inputParser.parse("foo bar  fizz")).toEqual([
            "foo",
            "bar",
            "fizz"
        ]);
    });

    it("Asserts that InputParser honors quotes when splitting.", () => {
        const inputParser = new InputParser(['"', "'"]);

        expect(inputParser.parse("'foo bar'")).toEqual(["foo bar"]);
        expect(inputParser.parse("foo 'bar'")).toEqual(["foo", "bar"]);
        expect(inputParser.parse("foo 'bar  fizz'")).toEqual([
            "foo",
            "bar  fizz"
        ]);
    });
});
