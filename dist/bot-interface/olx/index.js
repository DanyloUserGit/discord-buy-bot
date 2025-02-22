"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopBotOlx = exports.ToOlx = exports.AccesoriesSubPannel = exports.womenSubPannel = exports.menSubPannel = exports.filterNavOlx = exports.filterOlx = exports.startOlx = void 0;
const discord_js_1 = require("discord.js");
const types_1 = require("../../parser/parser-olx/contracts/types");
exports.startOlx = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Starting bot")
        .setDescription("Click a button below!"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("olx_start").setLabel("Start bot").setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId("olx_filter").setLabel("Set filter").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId("olx_reset").setLabel("Reset filter").setStyle(discord_js_1.ButtonStyle.Danger))
};
exports.filterOlx = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Filter")
        .setDescription("Click a button below!"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("olx_category").setLabel("Category").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId("olx_price").setLabel("Price").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId("olx_filter_back").setLabel("<- Back").setStyle(discord_js_1.ButtonStyle.Danger))
};
exports.filterNavOlx = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Category")
        .setDescription("Click a button below!"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("olx_men").setLabel(types_1.categoryKeys[1]).setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId("olx_women").setLabel(types_1.categoryKeys[0]).setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId("olx_accesories").setLabel(types_1.categoryKeys[2]).setStyle(discord_js_1.ButtonStyle.Primary))
};
const selectMenuMen = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId(`select_men_olx`)
    .setPlaceholder('Subcategory (men)')
    .addOptions(types_1.subcategoryMenKeys.map(material => ({
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
    .setCustomId(`select_women_olx`)
    .setPlaceholder('Subcategory (women)')
    .addOptions(types_1.subcategoryWomenKeys.map(material => ({
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
    .setCustomId(`select_accesories_olx`)
    .setPlaceholder('Subcategory (accesories)')
    .addOptions(types_1.subcategoryAccesoriesKeys.map(material => ({
    label: material,
    value: material,
})));
exports.AccesoriesSubPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Select a subcategory'),
    rows: new discord_js_1.ActionRowBuilder().addComponents(selectMenuAccesories)
};
exports.ToOlx = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("To $:"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("button_price_to_olx").setLabel("To $:").setStyle(discord_js_1.ButtonStyle.Success))
};
exports.stopBotOlx = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Stop bot"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("olx_stop").setLabel("Stop bot").setStyle(discord_js_1.ButtonStyle.Danger))
};
