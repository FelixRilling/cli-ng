"use strict";

const getCommand = require("./getCommand");

module.exports = function (commandName, map, mapAliased, keysAliased) {
    if (!commandName) { //Return full list
        return {
            type: "success",
            data: {
                mode: "full",
                commands: map
            }
        };
    } else { //Return detailed command help
        return getCommand(commandName, mapAliased, keysAliased);
    }
};
