"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopBotShafa = exports.ToShafa = exports.AccesoriesSubPannel = exports.womenSubPannel = exports.menSubPannel = exports.filterNavShafa = exports.filterShafa = exports.startShafa = void 0;
const types_1 = require("./../../parser/parser-shafa/contracts/types");
const discord_js_1 = require("discord.js");
const types_2 = require("../../parser/parser-shafa/contracts/types");
exports.startShafa = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Starting bot")
        .setDescription("Click a button below!"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("shafa_start").setLabel("Start bot").setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId("shafa_filter").setLabel("Set filter").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId("shafa_reset").setLabel("Reset filter").setStyle(discord_js_1.ButtonStyle.Danger))
};
exports.filterShafa = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Filter")
        .setDescription("Click a button below!"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("shafa_category").setLabel("Category").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId("shafa_price").setLabel("Price").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId("shafa_filter_back").setLabel("<- Back").setStyle(discord_js_1.ButtonStyle.Danger))
};
exports.filterNavShafa = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Category")
        .setDescription("Click a button below!"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("shafa_men").setLabel("Чоловіки").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId("shafa_women").setLabel("Жінки").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId("shafa_accesories").setLabel("Аксесуари").setStyle(discord_js_1.ButtonStyle.Primary))
};
const selectMenuMen = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId(`select_men_shafa`)
    .setPlaceholder('Subcategory (men)')
    .addOptions(types_2.subcategoryMenNamesShafa.map(material => ({
    label: material,
    value: material,
})));
exports.menSubPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Select a subcategory'),
    rows: new discord_js_1.ActionRowBuilder().addComponents(selectMenuMen)
};
const selectMenuWomen = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId(`select_women_shafa`)
    .setPlaceholder('Subcategory (women)')
    .addOptions(types_2.subcategoryWomenNamesShafa.map(material => ({
    label: material,
    value: material,
})));
exports.womenSubPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Select a subcategory'),
    rows: new discord_js_1.ActionRowBuilder().addComponents(selectMenuWomen)
};
const selectMenuAccesories = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId(`select_accesories_shafa`)
    .setPlaceholder('Subcategory (accesories)')
    .addOptions(types_1.subcategoryAccesoriesNamesShafa.map(material => ({
    label: material,
    value: material,
})));
exports.AccesoriesSubPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Select a subcategory'),
    rows: new discord_js_1.ActionRowBuilder().addComponents(selectMenuAccesories)
};
exports.ToShafa = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("To $:"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("button_price_to_shafa").setLabel("To $:").setStyle(discord_js_1.ButtonStyle.Success))
};
exports.stopBotShafa = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Stop bot"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("shafa_stop").setLabel("Stop bot").setStyle(discord_js_1.ButtonStyle.Danger))
};
