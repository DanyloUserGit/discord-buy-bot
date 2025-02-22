import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder } from "discord.js";

export interface ButtonsPanel {
    embed: EmbedBuilder;
    buttons: ActionRowBuilder<ButtonBuilder>;
    rows?: ActionRowBuilder<ButtonBuilder>[];
}
export interface ButtonsMultiplePanel {
    embed: EmbedBuilder;
    rows: ActionRowBuilder<ButtonBuilder>[];
}
export interface SearchModalPannel {
  modal: ModalBuilder;
  input: TextInputBuilder;
}