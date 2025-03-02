"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commands_1 = require("./bot-interface/commands");
const olx_1 = require("./bot-interface/olx/olx");
const shafa_1 = require("./bot-interface/shafa/shafa");
const vinted_1 = require("./bot-interface/vinted/vinted");
const config_1 = require("./config");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildPresences
    ],
    rest: {
        timeout: 60000,
    }
});
(0, commands_1.setupCommands)(client);
(0, vinted_1.setupEventHandlersVinted)(client);
(0, olx_1.setupEventHandlersOlx)(client);
(0, shafa_1.setupEventHandlersShafa)(client);
client.login(config_1.AppConfig.BOT_TOKEN);
