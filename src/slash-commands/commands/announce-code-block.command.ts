import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandRoleOption, SlashCommandStringOption } from 'discord.js';
import { SlashCommand } from '../common';

const announceCodeBlockCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('announce_code_block')
    .setDescription('📢 Announce something, but in code block 📢')
    .setDMPermission(false)
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('paragraph').setDescription('Paragraph to be sent in announcement').setRequired(true)
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('paragraph_2').setDescription('Paragraph to be sent in announcement')
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('paragraph_3').setDescription('Paragraph to be sent in announcement')
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('paragraph_4').setDescription('Paragraph to be sent in announcement')
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('paragraph_5').setDescription('Paragraph to be sent in announcement')
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('paragraph_6').setDescription('Paragraph to be sent in announcement')
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('paragraph_7').setDescription('Paragraph to be sent in announcement')
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('paragraph_8').setDescription('Paragraph to be sent in announcement')
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('paragraph_9').setDescription('Paragraph to be sent in announcement')
    )
    .addRoleOption((option: SlashCommandRoleOption) =>
      option.setName('role').setDescription('Role to be mentioned in announcement')
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const roleOption = interaction.options.get('role')?.role?.id;
    const initialParagraph = interaction.options.get('paragraph')?.value?.toString() ?? '';

    let blockToBeSent = '```\n' + initialParagraph;

    for (let i = 2; i <= 9; i++) {
      let additionalParagraph = interaction.options.get(`paragraph_${i}`)?.value?.toString();

      if (additionalParagraph) {
        blockToBeSent += '\n\n' + additionalParagraph;
      }
    }

    blockToBeSent += '```';

    pathOfExileNews.announce(interaction.channelId, blockToBeSent, roleOption);
    interaction.reply({ content: 'Announcement created', ephemeral: true });
  },
};

export default announceCodeBlockCommand;
