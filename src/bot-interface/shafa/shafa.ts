import { Client, DMChannel, EmbedBuilder, Events, Message, TextChannel } from "discord.js";
import { AccesoriesSubPannel, ToShafa, filterNavShafa, filterShafa, menSubPannel, startShafa, stopBotShafa, womenSubPannel } from ".";
import { AppConfig } from "../../config";
import { logger } from "../../logger";
import { brandsShafa, subcategoryMenShafa } from "../../parser/parser-shafa/contracts/types";
import { ParserShafaImpl } from "../../parser/parser-shafa/impl";
import { autocomplete, autocompleteShafa, clearChannel } from "../../utils/commands";

const shafaParser = new ParserShafaImpl();

export function setupEventHandlersShafa(client: Client) {
    let category: string;
    let subcategory: string[];

      client.once(Events.ClientReady, async (readyClient) => {
            logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
            const channel = client.channels.cache.get(AppConfig.SHAFA_CHANNEL);
            if (channel instanceof TextChannel) {
                await channel.send({ embeds: [startShafa.embed], components: [startShafa.buttons] });
            }
        });
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton()) return;
        const channel = client.channels.cache.get(AppConfig.SHAFA_CHANNEL);
        if (!(channel instanceof TextChannel)) return;
        switch (interaction.customId) {
            case "shafa_filter":
                await channel.send({embeds: [filterShafa.embed], components: [filterShafa.buttons]})
                break;
            case "shafa_category":
                await channel.send({embeds: [filterNavShafa.embed], components: [filterNavShafa.buttons]})
                break;
            case "shafa_men":
                category = "men";
                await channel.send({embeds: [menSubPannel.embed], components: [menSubPannel.rows]})
                break;
            case "shafa_women":
                category = "women";
                await channel.send({embeds: [womenSubPannel.embed], components: [womenSubPannel.rows]})
                break;
            case "shafa_accesories":
                category = "aksesuary";
                await channel.send({embeds: [AccesoriesSubPannel.embed], components: [AccesoriesSubPannel.rows]})
                break;
            case "shafa_filter_back":
                await channel.send({embeds: [startShafa.embed], components: [startShafa.buttons]})
                break;
            case "shafa_start":
                shafaParser.startable = true;
                await channel.send({embeds: [startShafa.embed], components: [startShafa.buttons]})
                break;
            case "shafa_stop":
                shafaParser.startable = false;
                break;
            case "shafa_reset":
                shafaParser.addFilter({
                    category:"",
                    subcategory:"",
                    brands: []
                })
                await channel.send({embeds: [filterNavShafa.embed], components: [filterNavShafa.buttons]})
                break;
            case "shafa_price":
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
                            shafaParser.setFilterVal({price_from:number});
                            await channel.send({embeds: [ToShafa.embed], components:[ToShafa.buttons]});
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
                case "button_price_to_shafa":
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
                        shafaParser.setFilterVal({price_to:number});
                        await channel.send({embeds: [filterShafa.embed], components:[filterShafa.buttons]});
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
                        if (!shafaParser.startable) return;
                        const item = shafaParser.startable ? await shafaParser.autorun() : null;
                        if (item && shafaParser.startable) {
                            const card = new EmbedBuilder()
                                .setColor('#0099ff')
                                .setTitle(`${item.title}`)
                                .setURL(item.link)
                                .setImage(item.image)
                                .addFields(
                                    { name: '💰 Price', value: `${item.price}`, inline: true },
                                );
                            if (channel instanceof TextChannel) {
                                await channel.send({ embeds: [card] });
                                await channel.send({  components: [stopBotShafa.buttons]})
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
                    if(shafaParser.startable)
                        setTimeout(fetchAndSendItems, 20000);
                }
                fetchAndSendItems();
    })
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;
        const channel = client.channels.cache.get(AppConfig.SHAFA_CHANNEL);
    
        if (interaction.customId === 'select_men_shafa' || interaction.customId === 'select_women_shafa' ||
            interaction.customId === 'select_accesories_shafa'
         ) {
            const selected = interaction.values;
            subcategory = [...selected.flatMap((val)=>subcategoryMenShafa[val])];
            shafaParser.setFilterVal({
                category,
                subcategory
            })

            await interaction.update({ content: 'Option selected, processing...', components: [] });
            setTimeout(() => {
                interaction.message.delete().catch(console.error);
            }, 1000);

            if(channel instanceof TextChannel){
                await channel.send({embeds: [filterShafa.embed], components: [filterShafa.buttons]})
            }
        }
    })
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        const channel = client.channels.cache.get(AppConfig.SHAFA_CHANNEL);
      
        if (interaction.commandName === 'refresh') {
            await interaction.deferReply();
          if (channel instanceof TextChannel) 
            await clearChannel(channel);
        } 
    })
    client.on('interactionCreate', async interaction => {
        const channel = client.channels.cache.get(AppConfig.SHAFA_CHANNEL);
        if(interaction.isAutocomplete()){
            if (interaction.commandName === 'brandshafa') {
                await autocompleteShafa(interaction);
            } 
        }
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'brandshafa') {
                const brand = interaction.options.getString('query');
                await interaction.reply(`You searched for: **${brand}**`);
                if(brand && shafaParser.filter){
                    if(shafaParser.filter?.brands){
                        shafaParser.filter.brands.push(brandsShafa[brand]);
                    }else{
                        shafaParser.filter.brands = [brandsShafa[brand]];
                    }
                }
                if (channel instanceof TextChannel) 
                    await channel.send({embeds: [filterShafa.embed], components: [filterShafa.buttons]})
            }
          }
    })
}