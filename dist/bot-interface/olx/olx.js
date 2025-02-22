"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEventHandlersOlx = setupEventHandlersOlx;
const discord_js_1 = require("discord.js");
const _1 = require(".");
const config_1 = require("../../config");
const logger_1 = require("../../logger");
const types_1 = require("../../parser/parser-olx/contracts/types");
const impl_1 = require("../../parser/parser-olx/impl");
const commands_1 = require("../../utils/commands");
const olxParser = new impl_1.ParserOlxIml();
function setupEventHandlersOlx(client) {
    let category;
    let subcategory;
    client.once(discord_js_1.Events.ClientReady, async (readyClient) => {
        logger_1.logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
        const channel = client.channels.cache.get(config_1.AppConfig.OLX_CHANNEL);
        if (channel instanceof discord_js_1.TextChannel) {
            await channel.send({ embeds: [_1.startOlx.embed], components: [_1.startOlx.buttons] });
        }
    });
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton())
            return;
        const channel = client.channels.cache.get(config_1.AppConfig.OLX_CHANNEL);
        if (!(channel instanceof discord_js_1.TextChannel))
            return;
        switch (interaction.customId) {
            case "olx_filter":
                await channel.send({ embeds: [_1.filterOlx.embed], components: [_1.filterOlx.buttons] });
                break;
            case "olx_category":
                await channel.send({ embeds: [_1.filterNavOlx.embed], components: [_1.filterNavOlx.buttons] });
                break;
            case "olx_men":
                category = types_1.categoryOlx[types_1.categoryKeys[1]];
                await channel.send({ embeds: [_1.menSubPannel.embed], components: [_1.menSubPannel.rows] });
                break;
            case "olx_women":
                category = types_1.categoryOlx[types_1.categoryKeys[0]];
                await channel.send({ embeds: [_1.womenSubPannel.embed], components: [_1.womenSubPannel.rows] });
                break;
            case "olx_accesories":
                category = types_1.categoryOlx[types_1.categoryKeys[2]];
                await channel.send({ embeds: [_1.AccesoriesSubPannel.embed], components: [_1.AccesoriesSubPannel.rows] });
                break;
            case "olx_filter_back":
                await channel.send({ embeds: [_1.startOlx.embed], components: [_1.startOlx.buttons] });
                break;
            case "olx_start":
                olxParser.startable = true;
                break;
            case "olx_stop":
                olxParser.startable = false;
                break;
            case "olx_reset":
                olxParser.addFilter({
                    nav: {
                        category: "",
                        subcategory: [""]
                    },
                    brand: []
                });
                await channel.send({ embeds: [_1.filterNavOlx.embed], components: [_1.filterNavOlx.buttons] });
                break;
            case "olx_price":
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
                            olxParser.setFilterVal({ price_from: number });
                            await channel.send({ embeds: [_1.ToOlx.embed], components: [_1.ToOlx.buttons] });
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
            case "button_price_to_olx":
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
                            olxParser.setFilterVal({ price_to: number });
                            await channel.send({ embeds: [_1.filterOlx.embed], components: [_1.filterOlx.buttons] });
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
                if (!olxParser.startable)
                    return;
                const item = olxParser.startable ? await olxParser.autorun() : null;
                if (item && olxParser.startable) {
                    const card = new discord_js_1.EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle(`${item.title}`)
                        .setURL(item.link)
                        .setDescription(item.size)
                        .setImage(item.image)
                        .addFields({ name: '💰 Price', value: `${item.price}`, inline: true });
                    if (channel instanceof discord_js_1.TextChannel) {
                        await channel.send({ embeds: [card] });
                        await channel.send({ components: [_1.stopBotOlx.buttons] });
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
            if (olxParser.startable)
                setTimeout(fetchAndSendItems, 20000);
        }
        fetchAndSendItems();
    });
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isStringSelectMenu())
            return;
        const channel = client.channels.cache.get(config_1.AppConfig.OLX_CHANNEL);
        if (interaction.customId === 'select_men_olx' || interaction.customId === 'select_women_olx' ||
            interaction.customId === 'select_accesories_olx') {
            const selected = interaction.values;
            subcategory = [...selected.flatMap((val) => types_1.subcategoryMenOlx[val])];
            olxParser.setFilterVal({ nav: {
                    category,
                    subcategory
                } });
            await interaction.update({ content: 'Option selected, processing...', components: [] });
            setTimeout(() => {
                interaction.message.delete().catch(console.error);
            }, 1000);
            if (channel instanceof discord_js_1.TextChannel) {
                await channel.send({ embeds: [_1.filterOlx.embed], components: [_1.filterOlx.buttons] });
            }
        }
    });
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand())
            return;
        const channel = client.channels.cache.get(config_1.AppConfig.OLX_CHANNEL);
        if (interaction.commandName === 'clear') {
            await interaction.deferReply();
            if (channel instanceof discord_js_1.TextChannel)
                await (0, commands_1.clearChannel)(channel);
        }
    });
    client.on('interactionCreate', async (interaction) => {
        const channel = client.channels.cache.get(config_1.AppConfig.OLX_CHANNEL);
        if (interaction.isAutocomplete()) {
            if (interaction.commandName === 'brand') {
                await (0, commands_1.autocomplete)(interaction);
            }
        }
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'brand') {
                const brand = interaction.options.getString('query');
                await interaction.reply(`You searched for: **${brand}**`);
                if (olxParser.filter?.brand && brand)
                    olxParser.filter.brand.push(brand);
                if (channel instanceof discord_js_1.TextChannel)
                    await channel.send({ embeds: [_1.filterOlx.embed], components: [_1.filterOlx.buttons] });
            }
        }
    });
}
