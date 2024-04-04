import { Client, Events, GatewayIntentBits } from 'discord.js';
import { PoENews } from './services/poeNews.js';
import { Logger } from './utilities/logging.js';
import { registerSlashCommands } from './slash-commands/commands.js';
import { gracefulShutdown } from './utilities/functions.js';
import { ClientWithCommands } from './utilities/dataStructures.js';
import fs from 'fs';
import { registerClientEventHandlers } from './client-events/client-events.js';

globalThis.client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
}) as ClientWithCommands;
globalThis.configurationFile = {
  discordBotToken: '',
  discordApplicationId: '',
  poeConfig: {
    enabled: true,
    newsServer: '',
    refreshInterval: 60000,
    subscriberChannels: [],
  },
};

Logger.info(`PoENews bot starting`, { label: 'STARTUP' });

loadConfiguration();

globalThis.pathOfExileNews = new PoENews(client, configurationFile.poeConfig);
client.login(configurationFile.discordBotToken);

registerSlashCommands();
registerClientEventHandlers();

client.once(Events.ClientReady, () => {
  pathOfExileNews.start();
})

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);

function loadConfiguration(): void {
  Logger.info(`Loading configuration`, { label: 'CONFIG' });
  try {
    Object.assign(configurationFile, JSON.parse(fs.readFileSync('./config/settings.json', 'utf-8')));
  } catch (error) {
    Logger.error(`Failed to read configuration file: ${error}`, { label: 'CONFIG' });
  }
}
