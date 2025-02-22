"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEventHandlersShafa = setupEventHandlersShafa;
const discord_js_1 = require("discord.js");
const _1 = require(".");
const config_1 = require("../../config");
const logger_1 = require("../../logger");
const types_1 = require("../../parser/parser-shafa/contracts/types");
const impl_1 = require("../../parser/parser-shafa/impl");
const commands_1 = require("../../utils/commands");
const shafaParser = new impl_1.ParserShafaImpl();
function setupEventHandlersShafa(client) {
    let category;
    let subcategory;
    client.once(discord_js_1.Events.ClientReady, async (readyClient) => {
        logger_1.logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
        const channel = client.channels.cache.get(config_1.AppConfig.SHAFA_CHANNEL);
        if (channel instanceof discord_js_1.TextChannel) {
            await channel.send({ embeds: [_1.startShafa.embed], components: [_1.startShafa.buttons] });
        }
    });
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton())
            return;
        const channel = client.channels.cache.get(config_1.AppConfig.SHAFA_CHANNEL);
        if (!(channel instanceof discord_js_1.TextChannel))
            return;
        switch (interaction.customId) {
            case "shafa_filter":
                await channel.send({ embeds: [_1.filterShafa.embed], components: [_1.filterShafa.buttons] });
                break;
            case "shafa_category":
                await channel.send({ embeds: [_1.filterNavShafa.embed], components: [_1.filterNavShafa.buttons] });
                break;
            case "shafa_men":
                category = "men";
                await channel.send({ embeds: [_1.menSubPannel.embed], components: [_1.menSubPannel.rows] });
                break;
            case "shafa_women":
                category = "women";
                await channel.send({ embeds: [_1.womenSubPannel.embed], components: [_1.womenSubPannel.rows] });
                break;
            case "shafa_accesories":
                category = "aksesuary";
                await channel.send({ embeds: [_1.AccesoriesSubPannel.embed], components: [_1.AccesoriesSubPannel.rows] });
                break;
            case "shafa_filter_back":
                await channel.send({ embeds: [_1.startShafa.embed], components: [_1.startShafa.buttons] });
                break;
            case "shafa_start":
                shafaParser.startable = true;
                await channel.send({ embeds: [_1.startShafa.embed], components: [_1.startShafa.buttons] });
                break;
            case "shafa_stop":
                shafaParser.startable = false;
                break;
            case "shafa_reset":
                shafaParser.addFilter({
                    category: "",
                    subcategory: "",
                    brands: []
                });
                await channel.send({ embeds: [_1.filterNavShafa.embed], components: [_1.filterNavShafa.buttons] });
                break;
            case "shafa_price":
                if (channel instanceof discord_js_1.TextChannel) {
                    if (!interaction.channel || !(interaction.channel instanceof discord_js_1.TextChannel || interaction.channel instanceof discord_js_1.DMChannel)) {
                        return interaction.followUp('I cannot collect messages in this channel.');
                    }
                    const filter = (m) => m.author.id === interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({
                        filter,
                        time: 15000,
                    });
                    collector.on('collect', async (message) => {
                        const number = parseInt(message.content);
                        if (!isNaN(number)) {
                            shafaParser.setFilterVal({ price_from: number });
                            await channel.send({ embeds: [_1.ToShafa.embed], components: [_1.ToShafa.buttons] });
                        }
                        else {
                            interaction.followUp('That is not a valid number. Please try again.');
                        }
                        collector.stop();
                    });
                    collector.on('end', (collected, reason) => {
                        if (reason === 'time') {
                            interaction.followUp('You took too long to respond. Please try again later.');
                        }
                    });
                }
                break;
            case "button_price_to_shafa":
                if (channel instanceof discord_js_1.TextChannel) {
                    if (!interaction.channel || !(interaction.channel instanceof discord_js_1.TextChannel || interaction.channel instanceof discord_js_1.DMChannel)) {
                        return interaction.followUp('I cannot collect messages in this channel.');
                    }
                    const filter = (m) => m.author.id === interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({
                        filter,
                        time: 15000,
                    });
                    collector.on('collect', async (message) => {
                        const number = parseInt(message.content);
                        if (!isNaN(number)) {
                            shafaParser.setFilterVal({ price_to: number });
                            await channel.send({ embeds: [_1.filterShafa.embed], components: [_1.filterShafa.buttons] });
                        }
                        else {
                            interaction.followUp('That is not a valid number. Please try again.');
                        }
                        collector.stop();
                    });
                    collector.on('end', (collected, reason) => {
                        if (reason === 'time') {
                            interaction.followUp('You took too long to respond. Please try again later.');
                        }
                    });
                }
                break;
            default:
                break;
        }
        async function fetchAndSendItems() {
            try {
                if (!shafaParser.startable)
                    return;
                const item = shafaParser.startable ? await shafaParser.autorun() : null;
                if (item && shafaParser.startable) {
                    const card = new discord_js_1.EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle(`${item.title}`)
                        .setURL(item.link)
                        .setImage(item.image)
                        .addFields({ name: '💰 Price', value: `${item.price}`, inline: true });
                    if (channel instanceof discord_js_1.TextChannel) {
                        await channel.send({ embeds: [card] });
                        await channel.send({ components: [_1.stopBotShafa.buttons] });
                    }
                }
            }
            catch (error) {
                console.error("Error fetching item:", error);
                if (channel instanceof discord_js_1.TextChannel) {
                    await channel.send({ embeds: [new discord_js_1.EmbedBuilder()
                                .setColor('#0099ff')
                                .setTitle("Product not found. Try to change filter")] });
                }
            }
            if (shafaParser.startable)
                setTimeout(fetchAndSendItems, 20000);
        }
        fetchAndSendItems();
    });
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isStringSelectMenu())
            return;
        const channel = client.channels.cache.get(config_1.AppConfig.SHAFA_CHANNEL);
        if (interaction.customId === 'select_men_shafa' || interaction.customId === 'select_women_shafa' ||
            interaction.customId === 'select_accesories_shafa') {
            const selected = interaction.values;
            subcategory = [...selected.flatMap((val) => types_1.subcategoryMenShafa[val])];
            shafaParser.setFilterVal({
                category,
                subcategory
            });
            await interaction.update({ content: 'Option selected, processing...', components: [] });
            setTimeout(() => {
                interaction.message.delete().catch(console.error);
            }, 1000);
            if (channel instanceof discord_js_1.TextChannel) {
                await channel.send({ embeds: [_1.filterShafa.embed], components: [_1.filterShafa.buttons] });
            }
        }
    });
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand())
            return;
        const channel = client.channels.cache.get(config_1.AppConfig.SHAFA_CHANNEL);
        if (interaction.commandName === 'refresh') {
            await interaction.deferReply();
            if (channel instanceof discord_js_1.TextChannel)
                await (0, commands_1.clearChannel)(channel);
        }
    });
    client.on('interactionCreate', async (interaction) => {
        const channel = client.channels.cache.get(config_1.AppConfig.SHAFA_CHANNEL);
        if (interaction.isAutocomplete()) {
            if (interaction.commandName === 'brandshafa') {
                await (0, commands_1.autocompleteShafa)(interaction);
            }
        }
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'brandshafa') {
                const brand = interaction.options.getString('query');
                await interaction.reply(`You searched for: **${brand}**`);
                if (brand && shafaParser.filter) {
                    if (shafaParser.filter?.brands) {
                        shafaParser.filter.brands.push(types_1.brandsShafa[brand]);
                    }
                    else {
                        shafaParser.filter.brands = [types_1.brandsShafa[brand]];
                    }
                }
                if (channel instanceof discord_js_1.TextChannel)
                    await channel.send({ embeds: [_1.filterShafa.embed], components: [_1.filterShafa.buttons] });
            }
        }
    });
}
