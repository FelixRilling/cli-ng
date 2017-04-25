"use strict";

const setDefaultIfNotArr = arr => arr instanceof Array ? arr : [];

module.exports = function (commands, Constructor) {
    const entries = Object.entries(commands);
    const entriesProccessed = entries.map(command => {
        const commandKey = command[0];
        const commandValue = command[1];

        //Saves name to keep track in aliases
        commandValue.name = commandKey;

        //Sets args and alias to default if given values dont fit
        commandValue.args = setDefaultIfNotArr(commandValue.args);
        commandValue.alias = setDefaultIfNotArr(commandValue.alias);

        if (commandValue.sub) {
            commandValue.sub = new Constructor(commandValue.sub); //Create a sub-instance for subgroups
        }

        return [commandKey, commandValue];
    });

    return new Map(entriesProccessed);
};
