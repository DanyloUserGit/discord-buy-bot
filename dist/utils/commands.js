"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearChannel = clearChannel;
exports.autocomplete = autocomplete;
exports.autocompleteShafa = autocompleteShafa;
exports.autocompleteVinted = autocompleteVinted;
const vinted_1 = require("../bot-interface/vinted");
const types_1 = require("../parser/parser-olx/contracts/types");
const types_2 = require("../parser/parser-shafa/contracts/types");
const types_3 = require("../parser/parser-vinted/contracts/types");
async function clearChannel(channel) {
    try {
        let fetched;
        do {
            fetched = await channel.messages.fetch({ limit: 100 });
            await channel.bulkDelete(fetched);
        } while (fetched.size >= 2);
        await channel.send({ embeds: [vinted_1.startButtonsPannel.embed], components: [vinted_1.startButtonsPannel.buttons] });
    }
    catch (error) {
        console.error('Error deleting messages:', error);
    }
}
async function autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const filtered = types_1.brandsOlx.filter(brand => brand.toLowerCase().includes(focusedValue.toLowerCase()));
    await interaction.respond(filtered.slice(0, 25).map(brand => ({ name: brand, value: brand })));
}
async function autocompleteShafa(interaction) {
    const focusedValue = interaction.options.getFocused();
    const filtered = types_2.brandsValuesShafa.filter(brand => brand.toLowerCase().includes(focusedValue.toLowerCase()));
    await interaction.respond(filtered.slice(0, 25).map(brand => ({ name: brand, value: brand })));
}
async function autocompleteVinted(interaction) {
    const focusedValue = interaction.options.getFocused();
    const filtered = types_3.brands.filter(brand => brand.toLowerCase().includes(focusedValue.toLowerCase()));
    await interaction.respond(filtered.slice(0, 25).map(brand => ({ name: brand, value: brand })));
}
