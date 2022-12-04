import { Collection, REST, Routes } from 'discord.js';
import { Logger } from '../utilities/logging.js';
import { SlashCommand } from './common';
import killCommand from './commands/kill.command.js';
import announceCommand from './commands/announce.command.js';
import announceCodeBlockCommand from './commands/announce-code-block.command.js';

export function registerSlashCommands(): void {
  Logger.info(`Loading bot commands`, { label: 'COMMANDS' });

  client.commands = new Collection<string, SlashCommand>();

  client.commands.set(killCommand.data.name, killCommand);
  client.commands.set(announceCommand.data.name, announceCommand);
  client.commands.set(announceCodeBlockCommand.data.name, announceCodeBlockCommand);

  const rest = new REST({ version: '10' }).setToken(configurationFile.discordBotToken);
  rest
    .put(Routes.applicationCommands(configurationFile.discordApplicationId), {
      body: Array.from((client.commands as Collection<string, SlashCommand>).values()).map((slashCommand: SlashCommand) =>
        slashCommand.data.toJSON()
      ),
    })
    .then(() => {
      Logger.info(`Successfully loaded bot commands`, { label: 'COMMANDS' });
    })
    .catch((error) => {
      Logger.error(`An error occured while loading bot commands: ${error}`, { label: 'COMMANDS' });
    });
}
