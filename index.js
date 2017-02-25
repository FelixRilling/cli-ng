"use strict";

const getAliasedMap = require("./lib/getAliasedMap");
const addCommandToMap = require("./lib/addCommandToMap");
const getParsedCommand = require("./lib/getParsedCommand");
const getHelp = require("./lib/getHelp");
const getCommand = require("./lib/getCommand");

module.exports = class {
    constructor(commands) {
        const _this = this;

        _this.map = new Map();

        Object.keys(commands).forEach(key => {
            _this.map = addCommandToMap(_this.map, key, commands[key]);
        });

        _this.mapAliased = getAliasedMap(_this.map);
        _this.keysAliased = Array.from(_this.mapAliased.keys());
    }
    parse(str) {
        const _this = this;

        return getParsedCommand(str, _this.mapAliased, _this.keysAliased);
    }
    help(commandName) {
        const _this = this;

        return getHelp(commandName, _this.map, _this.mapAliased, _this.keysAliased);
    }
    get(commandName) {
        const _this = this;

        return getCommand(commandName, _this.mapAliased, _this.keysAliased);
    }
    set(commandName, command) {
        const _this = this;

        _this.map = addCommandToMap(_this.map, commandName, command);

        _this.mapAliased = getAliasedMap(_this.map);
        _this.keysAliased = Array.from(_this.mapAliased.keys());
    }
};
