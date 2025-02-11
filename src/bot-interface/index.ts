import { ButtonBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonStyle, EmbedBuilder, SelectMenuBuilder, StringSelectMenuBuilder } from "discord.js";
import { brandMap, brands } from "../parser/parser-vinted/contracts/types";

export interface ButtonsPanel {
    embed: EmbedBuilder;
    buttons: ActionRowBuilder<ButtonBuilder>;
    rows?: ActionRowBuilder<ButtonBuilder>[];
}
export interface ButtonsMultiplePanel {
    embed: EmbedBuilder;
    rows: ActionRowBuilder<ButtonBuilder>[];
}
export const startButtonsPannel:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Starting bot")
    .setDescription("Click a button below!"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("button_start").setLabel("Start bot").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("button_filter").setLabel("Set filter").setStyle(ButtonStyle.Primary)
    )
}
export const selectCountry:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Select one country"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("button_country_PL").setLabel("PL").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("button_country_GE").setLabel("GE").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("button_country_UK").setLabel("UK").setStyle(ButtonStyle.Primary)
    )
}
export const filterPannel:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Filter pannel"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("button_country").setLabel("Country").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("button_brand").setLabel("Brand").setStyle(ButtonStyle.Primary),
    )
}
const selectMenu = new StringSelectMenuBuilder()
.setCustomId('select_brand') 
.setPlaceholder('Select a brand...') 
.addOptions(
    brands.slice(0, 25).map(brand => ({
        label: brand,  
        value: brand.toLowerCase() 
    }))
);
export const brandsPannel = {
    embed: new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Select a brand'),
    rows: new ActionRowBuilder<SelectMenuBuilder>().addComponents(selectMenu)
};