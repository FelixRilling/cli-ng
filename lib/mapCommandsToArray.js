"use strict";

const merge = require("lodash/merge");

const commandValueDefault = {
    fn: null,
    alias: [],
    args: []
};

module.exports = obj => Object.entries(obj).map(command => {
    const commandKey = command[0];
    const commandValue = command[1];
    const result = merge(commandValueDefault, commandValue);

    result.name = commandKey;

    return [commandKey, result];
});
