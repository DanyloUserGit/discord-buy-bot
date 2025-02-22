"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBrandModal = exports.womenAccessoriesPannel = exports.womenClothingPannel = exports.women = exports.men = exports.menAccessoriesPannel = exports.menClothingPannel = exports.brandsPannel = exports.filterPannelNext = exports.filterPannel = exports.To = exports.stopBot = exports.startButtonsPannel = void 0;
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const types_1 = require("../../parser/parser-vinted/contracts/types");
exports.startButtonsPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Starting bot")
        .setDescription("Click a button below!"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("button_start").setLabel("Start bot").setStyle(discord_js_1.ButtonStyle.Success), new builders_1.ButtonBuilder().setCustomId("button_filter").setLabel("Set filter").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_token").setLabel("Set token").setStyle(discord_js_1.ButtonStyle.Secondary), new builders_1.ButtonBuilder().setCustomId("button_reset").setLabel("Reset filter").setStyle(discord_js_1.ButtonStyle.Danger))
};
exports.stopBot = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Stop bot"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("button_autobuy").setLabel("Autobuy").setStyle(discord_js_1.ButtonStyle.Success), new builders_1.ButtonBuilder().setCustomId("button_stop").setLabel("Stop bot").setStyle(discord_js_1.ButtonStyle.Danger))
};
exports.To = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("To $:"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("button_price_to").setLabel("To $:").setStyle(discord_js_1.ButtonStyle.Success))
};
exports.filterPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Filter pannel"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("button_brand").setLabel("Brand").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_men").setLabel("Men").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_women").setLabel("Women").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_filter_back").setLabel("<- Back").setStyle(discord_js_1.ButtonStyle.Danger), new builders_1.ButtonBuilder().setCustomId("button_next").setLabel("Next page ->").setStyle(discord_js_1.ButtonStyle.Secondary))
};
exports.filterPannelNext = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Filter pannel next"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("button_price").setLabel("Price").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_prev").setLabel("<- Previous page").setStyle(discord_js_1.ButtonStyle.Secondary))
};
const selectMenu = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId(`select_brand`)
    .setPlaceholder('Select brand')
    .addOptions(types_1.brands.slice(0, 25).map(material => ({
    label: material,
    value: material.toLowerCase(),
})))
    .setMinValues(1)
    .setMaxValues(25);
exports.brandsPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Select a brand'),
    rows: new discord_js_1.ActionRowBuilder().addComponents(selectMenu)
};
const selectMenuMenClothing = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId(`select_men_clothing`)
    .setPlaceholder('Select men clothing')
    .addOptions(types_1.menNames.clothing.map(material => ({
    label: material,
    value: material.toLowerCase()
})))
    .setMinValues(1)
    .setMaxValues(13);
exports.menClothingPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Select men clothing'),
    rows: new discord_js_1.ActionRowBuilder().addComponents(selectMenuMenClothing)
};
const selectMenuMenAccessories = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId(`select_men_accessories`)
    .setPlaceholder('Select men accessories')
    .addOptions(types_1.menNames.accesories.map(material => ({
    label: material,
    value: material.toLowerCase()
})))
    .setMinValues(1)
    .setMaxValues(15);
exports.menAccessoriesPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Select men accessories'),
    rows: new discord_js_1.ActionRowBuilder().addComponents(selectMenuMenAccessories)
};
exports.men = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Men subcategories"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("button_men_clothing").setLabel("Clothing").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_men_accessories").setLabel("Accessories").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_men_back").setLabel("<- Back").setStyle(discord_js_1.ButtonStyle.Secondary))
};
exports.women = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Women subcategories"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("button_women_clothing").setLabel("Clothing").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_women_accessories").setLabel("Accessories").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_women_back").setLabel("<- Back").setStyle(discord_js_1.ButtonStyle.Secondary))
};
const selectMenuWomenClothing = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId(`select_women_clothing`)
    .setPlaceholder('Select women clothing')
    .addOptions(types_1.womenNames.clothing.map(material => ({
    label: material,
    value: material.toLowerCase()
})))
    .setMinValues(1)
    .setMaxValues(16);
exports.womenClothingPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Select women clothing'),
    rows: new discord_js_1.ActionRowBuilder().addComponents(selectMenuWomenClothing)
};
const selectMenuWomenAccessories = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId(`select_women_accessories`)
    .setPlaceholder('Select women accessories')
    .addOptions(types_1.womenNames.accesories.map(material => ({
    label: material,
    value: material.toLowerCase()
})))
    .setMinValues(1)
    .setMaxValues(13);
exports.womenAccessoriesPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Select women accessories'),
    rows: new discord_js_1.ActionRowBuilder().addComponents(selectMenuWomenAccessories)
};
const modalBrand = new discord_js_1.ModalBuilder()
    .setCustomId('searchModalBrand')
    .setTitle('Search for a brand');
const searchInputBrand = new discord_js_1.TextInputBuilder()
    .setCustomId('searchInputBrand')
    .setLabel('Enter brand name:')
    .setStyle(discord_js_1.TextInputStyle.Short);
const actionRow = new discord_js_1.ActionRowBuilder().addComponents(searchInputBrand);
modalBrand.addComponents(actionRow);
exports.SearchBrandModal = {
    modal: modalBrand,
    input: searchInputBrand
};
