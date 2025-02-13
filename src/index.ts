import { Client, EmbedBuilder, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, TextChannel } from "discord.js";
import { brandsPannel, filterPannel, filterPannelNext, men, menAccessoriesPannel, menClothingPannel, startButtonsPannel, stopBot, women, womenAccessoriesPannel, womenClothingPannel } from "./bot-interface";
import { AppConfig } from "./config";
import { logger } from "./logger";
import { brandMap, menAccesoriesMap, menClothingMap, womenAccesoriesMap, womenClothingMap } from "./parser/parser-vinted/contracts/types";
import { ParserVintedImpl } from "./parser/parser-vinted/impl";
import { clearChannel } from "./utils/commands";

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
        timeout: 60000,
    }
});

const commands = [
    new SlashCommandBuilder()
      .setName('cls')
      .setDescription('Clears all messages in the channel')
      .toJSON(),
    new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops sending of products')
        .toJSON(),
  ];
  
  const rest = new REST({ version: '10' }).setToken(AppConfig.BOT_TOKEN);
  
  (async () => {
    try {
      console.log('Registering /cls command...');
  
      await rest.put(
        Routes.applicationGuildCommands(AppConfig.APP_ID, AppConfig.APPLICATION_ID),
        { body: commands },
      );
  
      console.log('Slash command registered!');
    } catch (error) {
      console.error(error);
    }
  })();

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
        parser.startable = true;
    } else if (interaction.customId === "button_filter") {
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
    }else if(interaction.customId === "button_reset"){
        parser.addFilter({
            order: "newest_first",
            disabled_personalization:true,
            page: 1,
            time:1738850547
        });
        if (channel instanceof TextChannel)
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] }); 
    }else if (interaction.customId === "button_token" && channel instanceof TextChannel) {
        await interaction.reply({ content: "Please enter your token:", ephemeral: true });
        const collector = channel.createMessageCollector({ time: 30000 });

        collector.on("collect", async (msg) => {
            parser.setOauthToken(msg.content);
            collector.stop();
            await channel.send({ embeds: [startButtonsPannel.embed], components: [startButtonsPannel.buttons] });
        });

        collector.on("end", async (collected, reason) => {
            if (reason === "time") {
                interaction.followUp({ content: "You took too long to respond", ephemeral: true });
                await channel.send({ embeds: [startButtonsPannel.embed], components: [startButtonsPannel.buttons] });
            }
        });
    }else if (interaction.customId === "button_stop") {
        parser.startable = false;
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [startButtonsPannel.embed], components: [startButtonsPannel.buttons] });
    }else if (interaction.customId === "button_autobuy") {
        // await parser.autobuy();
    } else if (interaction.customId === "button_men_clothing") {
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [menClothingPannel.embed], components: [menClothingPannel.rows] });
    } else if (interaction.customId === "button_men_accessories") {
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [menAccessoriesPannel.embed], components: [menAccessoriesPannel.rows] });
    } else if(interaction.customId === "button_men") {
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [men.embed], components: [men.buttons] });
    }else if(interaction.customId === "button_women") {
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [women.embed], components: [women.buttons] });
    }else if(interaction.customId === "button_men_back") {
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
    }else if(interaction.customId === "button_women_back") {
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
    }else if (interaction.customId === "button_women_clothing") {
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [womenClothingPannel.embed], components: [womenClothingPannel.rows] });
    } else if (interaction.customId === "button_women_accessories") {
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [womenAccessoriesPannel.embed], components: [womenAccessoriesPannel.rows] });
    }else if (interaction.customId === "button_filter_back") {
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [startButtonsPannel.embed], components: [startButtonsPannel.buttons] });
    }
    async function fetchAndSendItems() {
        try {
            if (!parser.startable) return;
            const requestTime = Math.floor(new Date().getTime()/1000.0)
            parser.setFilterValue({time: requestTime})
            parser.generateUrl();
            if(parser.urls){
                for (const url of parser.urls){
                    const item = parser.startable ? await parser.autorun(url, requestTime) : null;
                    if (item && parser.startable) {
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
                        if (channel instanceof TextChannel) {
                            await channel.send({ embeds: [card] });
                            await channel.send({  components: [stopBot.buttons]})
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching item:", error);
            if (channel instanceof TextChannel) {
                await channel.send({ embeds: [new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("Product not found. Try to change filter")] })
            }
        }
        if(parser.startable)
            setTimeout(fetchAndSendItems, 5600);
    }
    fetchAndSendItems();
    switch (interaction.customId) {
        case "button_brand":
            if (channel instanceof TextChannel){
                await channel.send({ embeds: [brandsPannel.embed], components: [brandsPannel.rows] });
            }
        break;
        case "button_next":
            if (channel instanceof TextChannel) 
                await channel.send({ embeds: [filterPannelNext.embed], components: [filterPannelNext.buttons] });
        break;
        case "button_prev":
            if (channel instanceof TextChannel) 
                await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
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
    if (!interaction.isStringSelectMenu()) return;
    const channel = client.channels.cache.get(AppConfig.MAIN_CHANNEL);

    if (interaction.customId === 'select_brand') {
        const selectedBrand = interaction.values; 
        parser.setFilterValue({brand_ids:[...selectedBrand.flatMap((it)=>brandMap[it])]})

        await interaction.update({ content: 'Option selected, processing...', components: [] });
        setTimeout(() => {
            interaction.message.delete().catch(console.error);
        }, 1000);

        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
    }
    if (interaction.customId === 'select_men_clothing') {
        const selected = interaction.values; 
        parser.setFilterValue({catalog:[...selected.flatMap((it)=>menClothingMap[it])]})

        await interaction.update({ content: 'Option selected, processing...', components: [] });
        setTimeout(() => {
            interaction.message.delete().catch(console.error);
        }, 1000);

        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
    }
    if (interaction.customId === 'select_men_accessories') {
        const selected = interaction.values; 
        parser.setFilterValue({catalog:[...selected.flatMap((it)=>menAccesoriesMap[it])]})

        await interaction.update({ content: 'Option selected, processing...', components: [] });
        setTimeout(() => {
            interaction.message.delete().catch(console.error);
        }, 1000);

        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
    }
    if (interaction.customId === 'select_women_clothing') {
        const selected = interaction.values; 
        parser.setFilterValue({catalog:[...selected.flatMap((it)=>womenClothingMap[it])]})

        await interaction.update({ content: 'Option selected, processing...', components: [] });
        setTimeout(() => {
            interaction.message.delete().catch(console.error);
        }, 1000);

        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
    }
    if (interaction.customId === 'select_women_accessories') {
        const selected = interaction.values; 
        parser.setFilterValue({catalog:[...selected.flatMap((it)=>womenAccesoriesMap[it])]})

        await interaction.update({ content: 'Option selected, processing...', components: [] });
        setTimeout(() => {
            interaction.message.delete().catch(console.error);
        }, 1000);

        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
    }
})
client.on('interactionCreate', async interaction => {
    const channel = client.channels.cache.get(AppConfig.MAIN_CHANNEL);
    if (!interaction.isCommand()) return;
  
    if (interaction.commandName === 'cls') {
      await interaction.deferReply();
      if (channel instanceof TextChannel) 
        await clearChannel(channel);
    } else if(interaction.commandName === 'stop'){
        await interaction.deferReply();
        parser.startable = false;
        if (channel instanceof TextChannel) 
            await channel.send({ embeds: [filterPannel.embed], components: [filterPannel.buttons] });
    }
})

client.login(AppConfig.BOT_TOKEN);
