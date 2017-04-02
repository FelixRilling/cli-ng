"use strict";

module.exports = obj => Object.entries(obj).map(command => {
    const key = command[0];
    const val = command[1];

    val.name = key;

    return command;
});
