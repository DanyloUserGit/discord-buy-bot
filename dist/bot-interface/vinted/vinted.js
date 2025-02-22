"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEventHandlersVinted = setupEventHandlersVinted;
const discord_js_1 = require("discord.js");
const impl_1 = require("../../parser/parser-vinted/impl");
const impl_2 = require("../../utils/conventer/impl");
const _1 = require(".");
const config_1 = require("../../config");
const logger_1 = require("../../logger");
const types_1 = require("../../parser/parser-vinted/contracts/types");
const commands_1 = require("../../utils/commands");
const parser = new impl_1.ParserVintedImpl();
const conventer = new impl_2.ConventerImpl();
const flags = ['🇬🇧', '🇵🇱', '🇩🇪'];
parser.addFilter({
    order: "newest_first",
    disabled_personalization: true,
    page: 1,
    time: 1738850547
});
function startInterval() {
    setInterval(async () => {
        try {
            await conventer.getCourse();
        }
        catch (error) {
            console.error('Error in myAsyncFunction:', error);
        }
    }, 1000 * 60 * 60 * 12);
}
function setupEventHandlersVinted(client) {
    client.once(discord_js_1.Events.ClientReady, async (readyClient) => {
        logger_1.logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
        const channel = client.channels.cache.get(config_1.AppConfig.MAIN_CHANNEL);
        if (channel instanceof discord_js_1.TextChannel) {
            await channel.send({ embeds: [_1.startButtonsPannel.embed], components: [_1.startButtonsPannel.buttons] });
        }
        await conventer.getCourse();
        startInterval();
    });
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton())
            return;
        const channel = client.channels.cache.get(config_1.AppConfig.MAIN_CHANNEL);
        if (interaction.customId === "button_start") {
            parser.startable = true;
        }
        else if (interaction.customId === "button_filter") {
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
        }
        else if (interaction.customId === "button_reset") {
            parser.addFilter({
                order: "newest_first",
                disabled_personalization: true,
                page: 1,
                time: 1738850547
            });
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
        }
        else if (interaction.customId === "button_token" && channel instanceof discord_js_1.TextChannel) {
            await interaction.reply({ content: "Please enter your token:", ephemeral: true });
            const collector = channel.createMessageCollector({ time: 30000 });
            collector.on("collect", async (msg) => {
                parser.setOauthToken(msg.content);
                collector.stop();
                await channel.send({ embeds: [_1.startButtonsPannel.embed], components: [_1.startButtonsPannel.buttons] });
            });
            collector.on("end", async (collected, reason) => {
                if (reason === "time") {
                    interaction.followUp({ content: "You took too long to respond", ephemeral: true });
                    await channel.send({ embeds: [_1.startButtonsPannel.embed], components: [_1.startButtonsPannel.buttons] });
                }
            });
        }
        else if (interaction.customId === "button_stop") {
            parser.startable = false;
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.startButtonsPannel.embed], components: [_1.startButtonsPannel.buttons] });
        }
        else if (interaction.customId === "button_autobuy") {
        }
        else if (interaction.customId === "button_men_clothing") {
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.menClothingPannel.embed], components: [_1.menClothingPannel.rows] });
        }
        else if (interaction.customId === "button_men_accessories") {
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.menAccessoriesPannel.embed], components: [_1.menAccessoriesPannel.rows] });
        }
        else if (interaction.customId === "button_men") {
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.men.embed], components: [_1.men.buttons] });
        }
        else if (interaction.customId === "button_women") {
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.women.embed], components: [_1.women.buttons] });
        }
        else if (interaction.customId === "button_men_back") {
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
        }
        else if (interaction.customId === "button_women_back") {
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
        }
        else if (interaction.customId === "button_women_clothing") {
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.womenClothingPannel.embed], components: [_1.womenClothingPannel.rows] });
        }
        else if (interaction.customId === "button_women_accessories") {
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.womenAccessoriesPannel.embed], components: [_1.womenAccessoriesPannel.rows] });
        }
        else if (interaction.customId === "button_filter_back") {
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.startButtonsPannel.embed], components: [_1.startButtonsPannel.buttons] });
        }
        async function fetchAndSendItems() {
            try {
                if (!parser.startable)
                    return;
                const requestTime = Math.floor(new Date().getTime() / 1000.0);
                parser.setFilterValue({ time: requestTime });
                parser.generateUrl(conventer.current);
                if (parser.urls) {
                    for (const url of parser.urls) {
                        const item = parser.startable ? await parser.autorun(url, requestTime) : null;
                        if (item && parser.startable) {
                            const priceEur = conventer.convertFrom(parser.countries[parser.urls.indexOf(url)], conventer.currentFrom, parseFloat(item.price.split(" ")[1].replace(",", ".").replace("£", "").replace("€", "")));
                            const card = new discord_js_1.EmbedBuilder()
                                .setColor('#0099ff')
                                .setTitle(`${flags[parser.urls.indexOf(url)]} ${item.name}`)
                                .setURL(item.link)
                                .setDescription(item.size)
                                .setImage(item.image_url)
                                .addFields({ name: '💰 Price', value: `${priceEur.toFixed(2).toString()} €`, inline: true }, { name: 'Time', value: `${(Math.floor(new Date().getTime() / 1000.0) - item.time)}s`, inline: true });
                            if (channel instanceof discord_js_1.TextChannel) {
                                await channel.send({ embeds: [card] });
                                await channel.send({ components: [_1.stopBot.buttons] });
                            }
                        }
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
            if (parser.startable)
                setTimeout(fetchAndSendItems, 5600);
        }
        fetchAndSendItems();
        switch (interaction.customId) {
            case "button_brand":
                if (channel instanceof discord_js_1.TextChannel) {
                    await channel.send({ embeds: [_1.brandsPannel.embed], components: [_1.brandsPannel.rows] });
                }
                break;
            case "button_next":
                if (channel instanceof discord_js_1.TextChannel)
                    await channel.send({ embeds: [_1.filterPannelNext.embed], components: [_1.filterPannelNext.buttons] });
                break;
            case "button_prev":
                if (channel instanceof discord_js_1.TextChannel)
                    await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
                break;
            case "button_price":
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
                        const number = parseFloat(message.content);
                        if (!isNaN(number)) {
                            parser.setFilterValue({ price_from: number });
                            await channel.send({ embeds: [_1.To.embed], components: [_1.To.buttons] });
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
            case "button_price_to":
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
                        const number = parseFloat(message.content);
                        if (!isNaN(number)) {
                            parser.setFilterValue({ price_to: number });
                            await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
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
        await interaction.update({ content: 'Processing...', components: [] });
        setTimeout(() => {
            interaction.message.delete().catch(console.error);
        }, 1000);
    });
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isStringSelectMenu())
            return;
        const channel = client.channels.cache.get(config_1.AppConfig.MAIN_CHANNEL);
        if (interaction.customId === 'select_brand') {
            const selectedBrand = interaction.values;
            parser.setFilterValue({ brand_ids: [...selectedBrand.flatMap((it) => types_1.brandMap[it])] });
            await interaction.update({ content: 'Option selected, processing...', components: [] });
            setTimeout(() => {
                interaction.message.delete().catch(console.error);
            }, 1000);
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
        }
        if (interaction.customId === 'select_men_clothing') {
            const selected = interaction.values;
            parser.setFilterValue({ catalog: [...selected.flatMap((it) => types_1.menClothingMap[it])] });
            await interaction.update({ content: 'Option selected, processing...', components: [] });
            setTimeout(() => {
                interaction.message.delete().catch(console.error);
            }, 1000);
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
        }
        if (interaction.customId === 'select_men_accessories') {
            const selected = interaction.values;
            parser.setFilterValue({ catalog: [...selected.flatMap((it) => types_1.menAccesoriesMap[it])] });
            await interaction.update({ content: 'Option selected, processing...', components: [] });
            setTimeout(() => {
                interaction.message.delete().catch(console.error);
            }, 1000);
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
        }
        if (interaction.customId === 'select_women_clothing') {
            const selected = interaction.values;
            parser.setFilterValue({ catalog: [...selected.flatMap((it) => types_1.womenClothingMap[it])] });
            console.log(selected.flatMap((it) => console.log(it)), types_1.womenClothingMap);
            await interaction.update({ content: 'Option selected, processing...', components: [] });
            setTimeout(() => {
                interaction.message.delete().catch(console.error);
            }, 1000);
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
        }
        if (interaction.customId === 'select_women_accessories') {
            const selected = interaction.values;
            parser.setFilterValue({ catalog: [...selected.flatMap((it) => types_1.womenAccesoriesMap[it])] });
            await interaction.update({ content: 'Option selected, processing...', components: [] });
            setTimeout(() => {
                interaction.message.delete().catch(console.error);
            }, 1000);
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
        }
    });
    client.on('interactionCreate', async (interaction) => {
        const channel = client.channels.cache.get(config_1.AppConfig.MAIN_CHANNEL);
        if (!interaction.isCommand())
            return;
        if (interaction.commandName === 'cls') {
            await interaction.deferReply();
            if (channel instanceof discord_js_1.TextChannel)
                await (0, commands_1.clearChannel)(channel);
        }
        else if (interaction.commandName === 'stop') {
            await interaction.deferReply();
            parser.startable = false;
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [_1.filterPannel.embed], components: [_1.filterPannel.buttons] });
        }
    });
}
