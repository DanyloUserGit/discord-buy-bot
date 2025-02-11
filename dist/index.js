"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const bot_interface_1 = require("./bot-interface");
const config_1 = require("./config");
const logger_1 = require("./logger");
const types_1 = require("./parser/parser-vinted/contracts/types");
const impl_1 = require("./parser/parser-vinted/impl");
const parser = new impl_1.ParserVintedImpl();
parser.addFilter({
    order: "newest_first",
    disabled_personalization: true,
    page: 1,
    time: 1738850547
});
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildPresences
    ],
    rest: {
        timeout: 60000
    }
});
client.once(discord_js_1.Events.ClientReady, async (readyClient) => {
    logger_1.logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
    const channel = client.channels.cache.get(config_1.AppConfig.MAIN_CHANNEL);
    if (channel instanceof discord_js_1.TextChannel) {
        await channel.send({ embeds: [bot_interface_1.startButtonsPannel.embed], components: [bot_interface_1.startButtonsPannel.buttons] });
    }
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton())
        return;
    const channel = client.channels.cache.get(config_1.AppConfig.MAIN_CHANNEL);
    if (interaction.customId === "button_start") {
        async function fetchAndSendItems() {
            try {
                const item = await parser.autorun();
                if (item) {
                    const card = new discord_js_1.EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle(item.name)
                        .setURL(item.link)
                        .setDescription(item.size)
                        .setImage(item.image_url)
                        .addFields({ name: '💰 Price', value: item.price, inline: true }, { name: 'Time', value: `${(Math.floor(new Date().getTime() / 1000.0) - item.time)}s`, inline: true });
                    if (channel instanceof discord_js_1.TextChannel)
                        await channel.send({ embeds: [card] });
                }
            }
            catch (error) {
                console.error("Error fetching item:", error);
            }
            setTimeout(fetchAndSendItems, 5600);
        }
        fetchAndSendItems();
    }
    else if (interaction.customId === "button_filter") {
        if (channel instanceof discord_js_1.TextChannel)
            await channel.send({ embeds: [bot_interface_1.filterPannel.embed], components: [bot_interface_1.filterPannel.buttons] });
    }
    switch (interaction.customId) {
        case "button_country_PL":
            parser.setCountry("PL");
            break;
        case "button_country_GE":
            parser.setCountry("GE");
            break;
        case "button_country_UK":
            parser.setCountry("UK");
            break;
        case "button_country":
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [bot_interface_1.selectCountry.embed], components: [bot_interface_1.selectCountry.buttons] });
            break;
        case "button_brand":
            if (channel instanceof discord_js_1.TextChannel)
                await channel.send({ embeds: [bot_interface_1.brandsPannel.embed], components: [bot_interface_1.brandsPannel.rows] });
            break;
        default:
            break;
    }
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu())
        return;
    const channel = client.channels.cache.get(config_1.AppConfig.MAIN_CHANNEL);
    if (interaction.customId === 'select_brand') {
        const selectedBrand = interaction.values[0];
        parser.setFilterValue({ brand_ids: [types_1.brandMap[selectedBrand]] });
        if (channel instanceof discord_js_1.TextChannel)
            await channel.send({ embeds: [bot_interface_1.filterPannel.embed], components: [bot_interface_1.filterPannel.buttons] });
    }
});
client.login(config_1.AppConfig.BOT_TOKEN);
