import { Interaction, SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute(interaction: Interaction): Promise<void>;
}
