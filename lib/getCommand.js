"use strict";

const getSimilarCommands = require("./getSimilarCommands");

module.exports = function (commandName, mapAliased, keysAliased) {
    if (mapAliased.has(commandName)) {
        const command = mapAliased.get(commandName);

        return {
            type: "success",
            data: {
                mode: "detail",
                command: command,
                caller: commandName
            }
        };
    } else {
        return getSimilarCommands(commandName, keysAliased);
    }
};
