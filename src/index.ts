import { Client, EmbedBuilder, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { brandsPannel, filterPannel, selectCountry, startButtonsPannel } from "./bot-interface";
import { AppConfig } from "./config";
import { logger } from "./logger";
import { brandMap } from "./parser/parser-vinted/contracts/types";
import { ParserVintedImpl } from "./parser/parser-vinted/impl";

const parser = new ParserVintedImpl();

parser.addFilter({
    order: "newest_first",
    disabled_personalization:true,
    page: 1,
    time:1738850547
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,          
        GatewayIntentBits.GuildMessages,     
        GatewayIntentBits.MessageContent,    
        GatewayIntentBits.GuildMembers,      
        GatewayIntentBits.GuildPresences     
    ],
    rest: {
        timeout: 60000
    }
});
client.once(Events.ClientReady, async (readyClient) => {
    logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
    
    const channel = client.channels.cache.get(AppConfig.MAIN_CHANNEL);
    if (channel instanceof TextChannel) {
        await channel.send({ embeds: [startButtonsPannel.embed], components: [startButtonsPannel.buttons] });
    }
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    const channel = client.channels.cache.get(AppConfig.MAIN_CHANNEL);

    if (interaction.customId === "button_start") {
        async function fetchAndSendItems() {
            try {
                const item = await parser.autorun();
                if (item) {
                    const card = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle(item.name)
                        .setURL(item.link)
                        .setDescription(item.size)
                        .setImage(item.image_url)
                        .addFields(
                            { name: '💰 Price', value: item.price, inline: true },
                            { name: 'Time', value: `${(Math.floor(new Date().getTime()/1000.0)-item.time)}s`, inline: true }
                        );
                    if (channel instanceof TextChannel) 
                        await channel.send({ embeds: [card] });
                }
            } catch (error) {
                console.error("Error fetching item:", error);
            }

            setTimeout(fetchAndSendItems, 5600);
        }
        fetchAndSendItems();
    } else if (interaction.customId === "button_filter") {
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
    } 
    switch (interaction.customId) {
        case "button_country_PL":
            parser.setCountry("PL")
            break;
        case "button_country_GE":
            parser.setCountry("GE")
        break;
        case "button_country_UK":
            parser.setCountry("UK")
        break;
        case "button_country":
            if (channel instanceof TextChannel) 
                await channel.send({ embeds: [selectCountry.embed], components: [selectCountry.buttons] });
        break;
        case "button_brand":
            if (channel instanceof TextChannel) 
                await channel.send({ embeds: [brandsPannel.embed], components: [brandsPannel.rows] });
        break;
        default:
            break;
    }
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    const channel = client.channels.cache.get(AppConfig.MAIN_CHANNEL);

    if (interaction.customId === 'select_brand') {
        const selectedBrand = interaction.values[0]; 
        parser.setFilterValue({brand_ids:[brandMap[selectedBrand]]})
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
    }
})

client.login(AppConfig.BOT_TOKEN);