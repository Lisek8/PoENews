import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandRoleOption, SlashCommandStringOption } from 'discord.js';
import { SlashCommand } from '../common';

const announceCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('📢 Announce something 📢')
    .setDMPermission(false)
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('message').setDescription('Message to be sent in announcement').setRequired(true)
    )
    .addRoleOption((option: SlashCommandRoleOption) =>
      option.setName('role').setDescription('Role to be mentioned in announcement')
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const roleOption = interaction.options.get('role')?.role?.id;
    const messageOption = interaction.options.get('message')?.value?.toString() ?? '';

    pathOfExileNews.announce(interaction.channelId, messageOption, roleOption);
    interaction.reply({ content: 'Announcement created', ephemeral: true });
  },
};

export default announceCommand;
