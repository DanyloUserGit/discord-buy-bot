"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandsPannel = exports.filterPannel = exports.selectCountry = exports.startButtonsPannel = void 0;
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const types_1 = require("../parser/parser-vinted/contracts/types");
exports.startButtonsPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Starting bot")
        .setDescription("Click a button below!"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("button_start").setLabel("Start bot").setStyle(discord_js_1.ButtonStyle.Success), new builders_1.ButtonBuilder().setCustomId("button_filter").setLabel("Set filter").setStyle(discord_js_1.ButtonStyle.Primary))
};
exports.selectCountry = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Select one country"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("button_country_PL").setLabel("PL").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_country_GE").setLabel("GE").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_country_UK").setLabel("UK").setStyle(discord_js_1.ButtonStyle.Primary))
};
exports.filterPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Filter pannel"),
    buttons: new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("button_country").setLabel("Country").setStyle(discord_js_1.ButtonStyle.Primary), new builders_1.ButtonBuilder().setCustomId("button_brand").setLabel("Brand").setStyle(discord_js_1.ButtonStyle.Primary))
};
const selectMenu = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId('select_brand')
    .setPlaceholder('Select a brand...')
    .addOptions(types_1.brands.slice(0, 25).map(brand => ({
    label: brand,
    value: brand.toLowerCase()
})));
exports.brandsPannel = {
    embed: new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Select a brand'),
    rows: new discord_js_1.ActionRowBuilder().addComponents(selectMenu)
};
