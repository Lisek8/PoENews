import { CacheType, Interaction } from 'discord.js';
import { SlashCommand } from '../../slash-commands/common';

export function registerInteractionCreateEventHandler(): void {
  client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = client.commands.get(interaction.commandName) as SlashCommand;

    if (command) {
      try {
        await command.execute(interaction);
      } catch (error) {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  });
}
