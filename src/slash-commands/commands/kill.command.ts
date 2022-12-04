import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { gracefulShutdown } from '../../utilities/functions.js';
import { Logger } from '../../utilities/logging.js';
import { SlashCommand } from '../common';

const KILL_COMMAND_DELAY = 2500;

const killCommand: SlashCommand = {
  data: new SlashCommandBuilder().setName('kill').setDescription('🧨 Initialize self destruct sequence! 🧨'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    Logger.info(`Self desctruct sequence initiated by:\n- USER_ID: ${interaction.user.id}\n- USER_NAME: ${interaction.user.username}`);
    await interaction.reply({ content: 'Self-destruct sequence initiated!', ephemeral: true });

    setTimeout(() => {
      gracefulShutdown();
    }, KILL_COMMAND_DELAY);
  },
};

export default killCommand;
