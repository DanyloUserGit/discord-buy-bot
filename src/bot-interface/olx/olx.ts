import { Client, DMChannel, EmbedBuilder, Events, Message, TextChannel } from "discord.js";
import { AccesoriesSubPannel, filterNavOlx, filterOlx, menSubPannel, startOlx, stopBotOlx, ToOlx, womenSubPannel } from ".";
import { AppConfig } from "../../config";
import { logger } from "../../logger";
import { categoryKeys, categoryOlx, subcategoryMenOlx } from "../../parser/parser-olx/contracts/types";
import { ParserOlxIml } from "../../parser/parser-olx/impl";
import { autocomplete, clearChannel } from "../../utils/commands";

const olxParser = new ParserOlxIml();

export function setupEventHandlersOlx(client: Client) {
    let category: string;
    let subcategory: string[];

      client.once(Events.ClientReady, async (readyClient) => {
            logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
            const channel = client.channels.cache.get(AppConfig.OLX_CHANNEL);
            if (channel instanceof TextChannel) {
                await channel.send({ embeds: [startOlx.embed], components: [startOlx.buttons] });
            }
        });
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton()) return;
        const channel = client.channels.cache.get(AppConfig.OLX_CHANNEL);
        if (!(channel instanceof TextChannel)) return;
        switch (interaction.customId) {
            case "olx_filter":
                await channel.send({embeds: [filterOlx.embed], components: [filterOlx.buttons]})
                break;
            case "olx_category":
                await channel.send({embeds: [filterNavOlx.embed], components: [filterNavOlx.buttons]})
                break;
            case "olx_men":
                category = categoryOlx[categoryKeys[1]];
                await channel.send({embeds: [menSubPannel.embed], components: [menSubPannel.rows]})
                break;
            case "olx_women":
                category = categoryOlx[categoryKeys[0]];
                await channel.send({embeds: [womenSubPannel.embed], components: [womenSubPannel.rows]})
                break;
            case "olx_accesories":
                category = categoryOlx[categoryKeys[2]];
                await channel.send({embeds: [AccesoriesSubPannel.embed], components: [AccesoriesSubPannel.rows]})
                break;
            case "olx_filter_back":
                await channel.send({embeds: [startOlx.embed], components: [startOlx.buttons]})
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
                        category:"",
                        subcategory:[""]
                    },
                    brand: []
                })
                await channel.send({embeds: [filterNavOlx.embed], components: [filterNavOlx.buttons]})
                break;
            case "olx_price":
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
                        const number = parseInt(message.content);
                        if (!isNaN(number)) {
                            olxParser.setFilterVal({price_from:number});
                            await channel.send({embeds: [ToOlx.embed], components:[ToOlx.buttons]});
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
                case "button_price_to_olx":
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
                    const number = parseInt(message.content);
                    if (!isNaN(number)) {
                        olxParser.setFilterVal({price_to:number});
                        await channel.send({embeds: [filterOlx.embed], components:[filterOlx.buttons]});
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
                async function fetchAndSendItems() {
                    try {
                        if (!olxParser.startable) return;
                        const item = olxParser.startable ? await olxParser.autorun() : null;
                        if (item && olxParser.startable) {
                            const card = new EmbedBuilder()
                                .setColor('#0099ff')
                                .setTitle(`${item.title}`)
                                .setURL(item.link)
                                .setDescription(item.size)
                                .setImage(item.image)
                                .addFields(
                                    { name: '💰 Price', value: `${item.price}`, inline: true },
                                );
                            if (channel instanceof TextChannel) {
                                await channel.send({ embeds: [card] });
                                await channel.send({  components: [stopBotOlx.buttons]})
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
                    if(olxParser.startable)
                        setTimeout(fetchAndSendItems, 20000);
                }
                fetchAndSendItems();
    })
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;
        const channel = client.channels.cache.get(AppConfig.OLX_CHANNEL);
    
        if (interaction.customId === 'select_men_olx' || interaction.customId === 'select_women_olx' ||
            interaction.customId === 'select_accesories_olx'
         ) {
            const selected = interaction.values;
            subcategory = [...selected.flatMap((val)=>subcategoryMenOlx[val])];
            olxParser.setFilterVal({nav:{
                category,
                subcategory
            }})

            await interaction.update({ content: 'Option selected, processing...', components: [] });
            setTimeout(() => {
                interaction.message.delete().catch(console.error);
            }, 1000);

            if(channel instanceof TextChannel){
                await channel.send({embeds: [filterOlx.embed], components: [filterOlx.buttons]})
            }
        }
    })
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        const channel = client.channels.cache.get(AppConfig.OLX_CHANNEL);
      
        if (interaction.commandName === 'clear') {
            await interaction.deferReply();
          if (channel instanceof TextChannel) 
            await clearChannel(channel);
        } 
    })
    client.on('interactionCreate', async interaction => {
        const channel = client.channels.cache.get(AppConfig.OLX_CHANNEL);
        if(interaction.isAutocomplete()){
            if (interaction.commandName === 'brand') {
                await autocomplete(interaction);
            } 
        }
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'brand') {
                const brand = interaction.options.getString('query');
                await interaction.reply(`You searched for: **${brand}**`);
                if(olxParser.filter?.brand && brand)
                    olxParser.filter.brand.push(brand);
                if (channel instanceof TextChannel) 
                    await channel.send({embeds: [filterOlx.embed], components: [filterOlx.buttons]})
            }
          }
    })
}