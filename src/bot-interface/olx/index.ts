import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";
import { ButtonsPanel } from "..";
import { categoryKeys, subcategoryAccesoriesKeys, subcategoryMenKeys, subcategoryWomenKeys } from "../../parser/parser-olx/contracts/types";

export const startOlx:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Starting bot")
    .setDescription("Click a button below!"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("olx_start").setLabel("Start bot").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("olx_filter").setLabel("Set filter").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("olx_reset").setLabel("Reset filter").setStyle(ButtonStyle.Danger)
    )
}
export const filterOlx:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Filter")
    .setDescription("Click a button below!"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("olx_category").setLabel("Category").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("olx_price").setLabel("Price").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("olx_filter_back").setLabel("<- Back").setStyle(ButtonStyle.Danger),
    )
}
export const filterNavOlx:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Category")
    .setDescription("Click a button below!"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("olx_men").setLabel(categoryKeys[1]).setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("olx_women").setLabel(categoryKeys[0]).setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("olx_accesories").setLabel(categoryKeys[2]).setStyle(ButtonStyle.Primary)
    )
}

const selectMenuMen =  new StringSelectMenuBuilder()
.setCustomId(`select_men_olx`) 
.setPlaceholder('Subcategory (men)')
.addOptions(
  subcategoryMenKeys.map(material => ({
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
.setCustomId(`select_women_olx`) 
.setPlaceholder('Subcategory (women)')
.addOptions(
  subcategoryWomenKeys.map(material => ({
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
.setCustomId(`select_accesories_olx`) 
.setPlaceholder('Subcategory (accesories)')
.addOptions(
  subcategoryAccesoriesKeys.map(material => ({
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
export const ToOlx:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("To $:"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("button_price_to_olx").setLabel("To $:").setStyle(ButtonStyle.Success),
    )
  }
  export const stopBotOlx:ButtonsPanel = {
    embed: new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Stop bot"),
    buttons: new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("olx_stop").setLabel("Stop bot").setStyle(ButtonStyle.Danger),
    )
}