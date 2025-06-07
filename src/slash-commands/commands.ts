import { Collection, REST, Routes } from 'discord.js';
import { Logger } from '../utilities/logging.js';
import { SlashCommand } from './common';
import leagueCommand from './commands/league.command.js';

export function registerSlashCommands(): void {
  Logger.info(`Loading bot commands`, { label: 'COMMANDS' });

  client.commands = new Collection<string, SlashCommand>();

  client.commands.set(leagueCommand.data.name, leagueCommand);

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
