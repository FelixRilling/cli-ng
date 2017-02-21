"use strict";

const similar = require("similar-strings");

module.exports = function (commandName, keysAliased) {
    const similarKeys = similar(commandName, keysAliased);

    return {
        type: "error",
        data: {
            err: "missingCommand",
            missing: commandName,
            similar: similarKeys
        }
    };
};
