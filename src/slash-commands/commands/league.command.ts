import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandRoleOption, SlashCommandStringOption } from 'discord.js';
import { SlashCommand } from '../common';
import leagueInfo from '../../app-data/league-info.json' assert { type: 'json' };

const leagueCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('leaguestart')
    .setDescription('Provides information of league start')
    .setDMPermission(false),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor(0x530191)
      .setTitle(leagueInfo.leagueName)
      .addFields({
        name: 'League start',
        value: `<t:${new Date(leagueInfo.leagueStartDate).getTime() / 1000}:R>`,
      });

    interaction.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
    });
  },
};

export default leagueCommand;
