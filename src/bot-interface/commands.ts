import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import { AppConfig } from "../config";

export function setupCommands(client: Client) {
    const commands = [
        new SlashCommandBuilder()
            .setName('cls')
            .setDescription('Clears all messages in the channel')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('clear')
            .setDescription('Clears all messages in the channel')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('stop')
            .setDescription('Stops sending of products')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('brandolx')
            .setDescription('Search with autocomplete')
            .addStringOption(option =>
              option.setName('query')
                .setDescription('Type to search')
                .setAutocomplete(true) 
            ),
        new SlashCommandBuilder()
        .setName('brandshafa')
        .setDescription('Search with autocomplete')
        .addStringOption(option =>
          option.setName('query')
            .setDescription('Type to search')
            .setAutocomplete(true) 
        ),     
        new SlashCommandBuilder()
        .setName('brandvinted')
        .setDescription('Search with autocomplete')
        .addStringOption(option =>
          option.setName('query')
            .setDescription('Type to search')
            .setAutocomplete(true) 
        ),
    ];
    const rest = new REST({ version: '10', timeout: 30000 }).setToken(AppConfig.BOT_TOKEN);

    (async () => {
        try {
            console.log('Registering commands...');
            await rest.put(
                Routes.applicationGuildCommands(AppConfig.APP_ID, AppConfig.APPLICATION_ID),
                { body: commands },
            );
            console.log('Slash commands registered!');
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    })();
}
