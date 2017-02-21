"use strict";

const parseCommand = require("./parseCommand");
const cfg = require("../../config.json");
const strings = require("../strings");
const commands = require("../commands");

module.exports = function (bot, msg) {
    const text = msg.content;
    //const log = bot._instance.log;
    const command = parseCommand(text.substr(cfg.prefix.length)); //Parse command string into command object
    const targetCommand = commands.commandsWithAlias[command.name]; //try to access command in command-object

    //log.info(`Parsing: ${msg.author.username}: '${text}'`);

    //If command exists, run it, and return the str as message
    if (targetCommand) {
        if (!targetCommand.admin || cfg.adminIds.includes(msg.author.id)) { //Checks if admin is required
            const targetCommandResult = targetCommand.fn(bot, msg, command.args);

            if (typeof targetCommandResult === "string") { //Checks if a string was returned (Text command)
                //log.info(`Running command: ${command.name}`);
                return {
                    type: targetCommand.outputType,
                    content: targetCommandResult
                };
            } else {
                //Else something went wrong
                //log.error(`Internal: in ${command.name}`);
                return {
                    type: "error",
                    content: strings.errorInternal
                };
            }
        } else {
            //log.notice(`Permission: '${text}'`);
            return {
                type: "error",
                content: strings.errorPermission
            };
        }
    } else {
        //log.notice(`NotFound: '${text}'`);
        return {
            type: "error",
            content: `${strings.infoUnknownCommand} '${command.name}'`
        };
    }
};
