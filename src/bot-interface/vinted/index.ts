import { ButtonBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, SelectMenuBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { brands, menNames, womenNames } from "../../parser/parser-vinted/contracts/types";
import { ButtonsPanel, SearchModalPannel } from "..";

export const startButtonsPannel:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Starting bot")
    .setDescription("Click a button below!"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("button_start").setLabel("Start bot").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("button_filter").setLabel("Set filter").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("button_token").setLabel("Set token").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("button_reset").setLabel("Reset filter").setStyle(ButtonStyle.Danger)
    )
}
export const stopBot:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Stop bot"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("button_autobuy").setLabel("Autobuy").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("button_stop").setLabel("Stop bot").setStyle(ButtonStyle.Danger),
    )
}
export const To:ButtonsPanel = {
  embed: new EmbedBuilder()
  .setColor("#0099ff")
  .setTitle("To $:"),
  buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("button_price_to").setLabel("To $:").setStyle(ButtonStyle.Success),
  )
}
export const filterPannel:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Filter pannel"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("button_men").setLabel("Men").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("button_women").setLabel("Women").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("button_filter_back").setLabel("<- Back").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("button_next").setLabel("Next page ->").setStyle(ButtonStyle.Secondary),
    )
}
export const filterPannelNext:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Filter pannel next"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("button_price").setLabel("Price").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("button_prev").setLabel("<- Previous page").setStyle(ButtonStyle.Secondary),
    )
}
  
  const selectMenu =  new StringSelectMenuBuilder()
      .setCustomId(`select_brand`) 
      .setPlaceholder('Select brand')
      .addOptions(
        brands.slice(0,25).map(material => ({
          label: material,
          value: material.toLowerCase(),
        }))
      )
      .setMinValues(1)
      .setMaxValues(25);


export const brandsPannel = {
    embed: new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Select a brand'),
    rows: new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)
};
const selectMenuMenClothing =  new StringSelectMenuBuilder()
.setCustomId(`select_men_clothing`) 
.setPlaceholder('Select men clothing')
.addOptions(
  menNames.clothing.map(material => ({
    label: material,
    value: material.toLowerCase()
  }))
)
.setMinValues(1)
.setMaxValues(13);


export const menClothingPannel = {
embed: new EmbedBuilder()
.setColor('#0099ff')
.setTitle('Select men clothing'),
rows: new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenuMenClothing)
};
const selectMenuMenAccessories =  new StringSelectMenuBuilder()
.setCustomId(`select_men_accessories`) 
.setPlaceholder('Select men accessories')
.addOptions(
  menNames.accesories.map(material => ({
    label: material,
    value: material.toLowerCase()
  }))
)
.setMinValues(1)
.setMaxValues(15);


export const menAccessoriesPannel = {
embed: new EmbedBuilder()
.setColor('#0099ff')
.setTitle('Select men accessories'),
rows: new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenuMenAccessories)
};
export const men:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Men subcategories"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("button_men_clothing").setLabel("Clothing").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("button_men_accessories").setLabel("Accessories").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("button_men_back").setLabel("<- Back").setStyle(ButtonStyle.Secondary),
    )
}
export const women:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Women subcategories"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("button_women_clothing").setLabel("Clothing").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("button_women_accessories").setLabel("Accessories").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("button_women_back").setLabel("<- Back").setStyle(ButtonStyle.Secondary),
    )
}
const selectMenuWomenClothing =  new StringSelectMenuBuilder()
.setCustomId(`select_women_clothing`) 
.setPlaceholder('Select women clothing')
.addOptions(
  womenNames.clothing.map(material => ({
    label: material,
    value: material.toLowerCase()
  }))
)
.setMinValues(1)
.setMaxValues(16);


export const womenClothingPannel = {
embed: new EmbedBuilder()
.setColor('#0099ff')
.setTitle('Select women clothing'),
rows: new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenuWomenClothing)
};
const selectMenuWomenAccessories =  new StringSelectMenuBuilder()
.setCustomId(`select_women_accessories`) 
.setPlaceholder('Select women accessories')
.addOptions(
  womenNames.accesories.map(material => ({
    label: material,
    value: material.toLowerCase()
  }))
)
.setMinValues(1)
.setMaxValues(13);


export const womenAccessoriesPannel = {
embed: new EmbedBuilder()
.setColor('#0099ff')
.setTitle('Select women accessories'),
rows: new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenuWomenAccessories)
};

const modalBrand = new ModalBuilder()
.setCustomId('searchModalBrand')
.setTitle('Search for a brand');

const searchInputBrand = new TextInputBuilder()
.setCustomId('searchInputBrand')
.setLabel('Enter brand name:')
.setStyle(TextInputStyle.Short);

const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(searchInputBrand);
modalBrand.addComponents(actionRow);

export const SearchBrandModal:SearchModalPannel = {
  modal: modalBrand,
  input: searchInputBrand
}