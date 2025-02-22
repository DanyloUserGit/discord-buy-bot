import { AutocompleteInteraction, CacheType, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { startButtonsPannel } from "../bot-interface/vinted";
import { brandsOlx } from "../parser/parser-olx/contracts/types";

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
export async function autocomplete(interaction:  AutocompleteInteraction) {
  const focusedValue = interaction.options.getFocused(); 
  const filtered = brandsOlx.filter(brand => brand.toLowerCase().includes(focusedValue.toLowerCase()));

  await interaction.respond(filtered.slice(0, 25).map(brand => ({ name: brand, value: brand })));
}