import { TextChannel } from "discord.js";
import { startButtonsPannel } from "../bot-interface";

export async function clearChannel(channel: TextChannel) {
    try {
      let fetched;
      do {
        fetched = await channel.messages.fetch({ limit: 100 });
        await channel.bulkDelete(fetched);
      } while (fetched.size >= 2);
      await channel.send({ embeds: [startButtonsPannel.embed], components: [startButtonsPannel.buttons] });
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
}
