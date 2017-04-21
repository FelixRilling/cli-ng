"use strict";

module.exports = obj => Object.entries(obj).map(command => {
    const commandKey = command[0];
    const commandValue = command[1];
    const result = Object.assign({}, commandValue);

    result.name = commandKey;

    return [commandKey, result];
});
