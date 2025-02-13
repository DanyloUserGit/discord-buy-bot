"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearChannel = clearChannel;
const bot_interface_1 = require("../bot-interface");
async function clearChannel(channel) {
    try {
        let fetched;
        do {
            fetched = await channel.messages.fetch({ limit: 100 });
            await channel.bulkDelete(fetched);
        } while (fetched.size >= 2);
        await channel.send({ embeds: [bot_interface_1.startButtonsPannel.embed], components: [bot_interface_1.startButtonsPannel.buttons] });
    }
    catch (error) {
        console.error('Error deleting messages:', error);
    }
}
