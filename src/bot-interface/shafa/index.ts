import { subcategoryAccesoriesNamesShafa } from './../../parser/parser-shafa/contracts/types';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";
import { ButtonsPanel } from "..";
import { subcategoryMenNamesShafa, subcategoryMenValuesShafa, subcategoryWomenNamesShafa } from "../../parser/parser-shafa/contracts/types";

export const startShafa:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Starting bot")
    .setDescription("Click a button below!"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("shafa_start").setLabel("Start bot").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("shafa_filter").setLabel("Set filter").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("shafa_reset").setLabel("Reset filter").setStyle(ButtonStyle.Danger)
    )
}
export const filterShafa:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Filter")
    .setDescription("Click a button below!"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("shafa_category").setLabel("Category").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("shafa_price").setLabel("Price").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("shafa_filter_back").setLabel("<- Back").setStyle(ButtonStyle.Danger),
    )
}
export const filterNavShafa:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Category")
    .setDescription("Click a button below!"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("shafa_men").setLabel("Чоловіки").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("shafa_women").setLabel("Жінки").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("shafa_accesories").setLabel("Аксесуари").setStyle(ButtonStyle.Primary)
    )
}

const selectMenuMen =  new StringSelectMenuBuilder()
.setCustomId(`select_men_shafa`) 
.setPlaceholder('Subcategory (men)')
.addOptions(
  subcategoryMenNamesShafa.map(material => ({
    label: material,
    value: material,
  }))
)
// .setMinValues(1)
// .setMaxValues(11);


export const menSubPannel = {
    embed: new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Select a subcategory'),
    rows: new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenuMen)
};

const selectMenuWomen =  new StringSelectMenuBuilder()
.setCustomId(`select_women_shafa`) 
.setPlaceholder('Subcategory (women)')
.addOptions(
    subcategoryWomenNamesShafa.map(material => ({
    label: material,
    value: material,
  }))
)
// .setMinValues(1)
// .setMaxValues(16);

export const womenSubPannel = {
    embed: new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Select a subcategory'),
    rows: new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenuWomen)
};

const selectMenuAccesories =  new StringSelectMenuBuilder()
.setCustomId(`select_accesories_shafa`) 
.setPlaceholder('Subcategory (accesories)')
.addOptions(
  subcategoryAccesoriesNamesShafa.map(material => ({
    label: material,
    value: material,
  }))
)
// .setMinValues(1)
// .setMaxValues(14);

export const AccesoriesSubPannel = {
    embed: new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Select a subcategory'),
    rows: new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenuAccesories)
};
export const ToShafa:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("To $:"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("button_price_to_shafa").setLabel("To $:").setStyle(ButtonStyle.Success),
    )
  }
  export const stopBotShafa:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Stop bot"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("shafa_stop").setLabel("Stop bot").setStyle(ButtonStyle.Danger),
    )
}