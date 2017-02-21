"use strict";

const strings = require("../strings");

module.exports = function (bot, msg, args) {
    const commands = require("../commands");
    const helpTopic = args[0];

    if (helpTopic) {
        const helpCommand = commands.commandsWithAlias[helpTopic];

        if (helpCommand) {
            const aliases = helpCommand.alias.map(alias => `'${alias}'`).join(", ");

            return [
                `Help for '${helpTopic}':`,
                strings.separator,
                `Description: ${helpCommand.help.desc}`,
                `Arguments: ${helpCommand.help.args}`,
                `Alias: ${aliases}`
            ].join("\n");
        } else {
            return `\`${strings.unknownCommand} '${helpTopic}'\``;
        }
    } else {
        const commandList = Object.keys(commands.commandsWithoutAdmin).sort().map(str => " - " + str).join("\n");

        return [
            "Help",
            strings.separator,
            commandList,
        ].join("\n");
    }
};
