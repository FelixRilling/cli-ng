"use strict";

const lev = require("../index.js");

describe("Main test", function () {

    it("Normal case", function () {
        expect(lev("Kitten", "Sitting")).toBe(3);
    });

    it("Simple case", function () {
        expect(lev("String", "Stribng")).toBe(1);
    });

    it("Position case", function () {
        expect(lev("Foo", "oof")).toBe(2);
    });

    it("Complex case", function () {
        expect(lev("!Lorem", "23Xd")).toBe(6);
    });

    it("Long case", function () {
        expect(lev("fooooooooooooooooooooooooooooooooooooooooooo", "fooooooooooooodooooooooooooooooooosa4oooooooo")).toBe(4);
    });

    it("Emtpy case", function () {
        expect(lev("", "")).toBe(0);
    });

    it("Half emtpy case", function () {
        expect(lev("Lorem", "")).toBe(5);
    });
});
