"use strict";

const parseCommand = require("./lib/parseCommand");

module.exports = class {
    constructor(commands) {
        const _this = this;

        _this.$map = new Map();
        _this.$map_aliased = new Map();

        Object.keys(commands).forEach((key, index) => {
            const value = commands[key];

            _this.$map.set(key, value);
            _this.$map_aliased.set(key, value);

            value.alias.forEach(alias => {
                _this.$map_aliased.set(alias, value);
            });
        });
    }
    parse(str) {
        const parsedCommand = parseCommand(str);

        console.log(parsedCommand);
    }
    help(command) {

    }
};
