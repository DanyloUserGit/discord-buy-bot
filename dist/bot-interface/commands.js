"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommands = setupCommands;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
function setupCommands(client) {
    const commands = [
        new discord_js_1.SlashCommandBuilder()
            .setName('cls')
            .setDescription('Clears all messages in the channel')
            .toJSON(),
        new discord_js_1.SlashCommandBuilder()
            .setName('clear')
            .setDescription('Clears all messages in the channel')
            .toJSON(),
        new discord_js_1.SlashCommandBuilder()
            .setName('stop')
            .setDescription('Stops sending of products')
            .toJSON(),
        new discord_js_1.SlashCommandBuilder()
            .setName('brandolx')
            .setDescription('Search with autocomplete')
            .addStringOption(option => option.setName('query')
            .setDescription('Type to search')
            .setAutocomplete(true)),
        new discord_js_1.SlashCommandBuilder()
            .setName('brandshafa')
            .setDescription('Search with autocomplete')
            .addStringOption(option => option.setName('query')
            .setDescription('Type to search')
            .setAutocomplete(true)),
        new discord_js_1.SlashCommandBuilder()
            .setName('brandvinted')
            .setDescription('Search with autocomplete')
            .addStringOption(option => option.setName('query')
            .setDescription('Type to search')
            .setAutocomplete(true)),
    ];
    const rest = new discord_js_1.REST({ version: '10', timeout: 30000 }).setToken(config_1.AppConfig.BOT_TOKEN);
    (async () => {
        try {
            console.log('Registering commands...');
            await rest.put(discord_js_1.Routes.applicationGuildCommands(config_1.AppConfig.APP_ID, config_1.AppConfig.APPLICATION_ID), { body: commands });
            console.log('Slash commands registered!');
        }
        catch (error) {
            console.error('Error registering commands:', error);
        }
    })();
}
