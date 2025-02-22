import { Client, DMChannel, EmbedBuilder, Events, Message, TextChannel } from "discord.js";
import { ParserVintedImpl } from "../../parser/parser-vinted/impl";
import { ConventerImpl } from "../../utils/conventer/impl";
import { startButtonsPannel, filterPannel, menClothingPannel, menAccessoriesPannel, men, women, womenClothingPannel, womenAccessoriesPannel, stopBot, brandsPannel, filterPannelNext, To } from ".";
import { AppConfig } from "../../config";
import { logger } from "../../logger";
import { brandMap, menClothingMap, menAccesoriesMap, womenClothingMap, womenAccesoriesMap } from "../../parser/parser-vinted/contracts/types";
import { clearChannel } from "../../utils/commands";

const parser = new ParserVintedImpl();
const conventer = new ConventerImpl();
const flags = ['🇬🇧', '🇵🇱', '🇩🇪'];

parser.addFilter({
    order: "newest_first",
    disabled_personalization:true,
    page: 1,
    time:1738850547
});

function startInterval() {
    setInterval(async () => {
      try {
        await conventer.getCourse()
      } catch (error) {
        console.error('Error in myAsyncFunction:', error);
      }
    }, 1000 * 60 * 60 * 12); 
  }

export function setupEventHandlersVinted(client: Client) {
    client.once(Events.ClientReady, async (readyClient) => {
        logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
        const channel = client.channels.cache.get(AppConfig.MAIN_CHANNEL);
        if (channel instanceof TextChannel) {
            await channel.send({ embeds: [startButtonsPannel.embed], components: [startButtonsPannel.buttons] });
        }
        await conventer.getCourse();
        startInterval()
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
                parser.generateUrl(conventer.current);
                if(parser.urls){
                    for (const url of parser.urls){
                        const item = parser.startable ? await parser.autorun(url, requestTime) : null;
                        if (item && parser.startable) {
                            const priceEur = conventer.convertFrom(parser.countries[parser.urls.indexOf(url)], 
                            conventer.currentFrom, parseFloat(item.price.split(" ")[1].replace(",", ".").replace("£", "").replace("€", "")));
                            const card = new EmbedBuilder()
                                .setColor('#0099ff')
                                .setTitle(`${flags[parser.urls.indexOf(url)]} ${item.name}`)
                                .setURL(item.link)
                                .setDescription(item.size)
                                .setImage(item.image_url)
                                .addFields(
                                    { name: '💰 Price', value: `${priceEur.toFixed(2).toString()} €`, inline: true },
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
            case "button_price":
                if (channel instanceof TextChannel) {
    
                    if (!interaction.channel || !(interaction.channel instanceof TextChannel || interaction.channel instanceof DMChannel)) {
                        return interaction.followUp('I cannot collect messages in this channel.');
                    }
    
                    const filter = (m: Message) => m.author.id === interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({
                        filter,
                        time: 15000, 
                    });
            
                    collector.on('collect', async(message) => {
                        const number = parseFloat(message.content);
                        if (!isNaN(number)) {
                            parser.setFilterValue({price_from:number});
                            await channel.send({embeds: [To.embed], components:[To.buttons]});
                        } else {
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
                    if (channel instanceof TextChannel) {
        
                        if (!interaction.channel || !(interaction.channel instanceof TextChannel || interaction.channel instanceof DMChannel)) {
                            return interaction.followUp('I cannot collect messages in this channel.');
                        }
        
                        const filter = (m: Message) => m.author.id === interaction.user.id;
                        const collector = interaction.channel.createMessageCollector({
                            filter,
                            time: 15000, 
                        });
                
                        collector.on('collect', async(message) => {
                            const number = parseFloat(message.content);
                            if (!isNaN(number)) {
                                parser.setFilterValue({price_to:number});
                                await channel.send({embeds: [filterPannel.embed], components:[filterPannel.buttons]});
                            } else {
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
            console.log(selected.flatMap((it)=>console.log(it)), womenClothingMap)
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
}