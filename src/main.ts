import { ActivityType, CacheType, Client, GatewayIntentBits, Interaction, Message } from 'discord.js';
import { PoENews } from './services/poeNews.js';
import { Twitter } from './services/twitter.js';
import { Logger } from './utilities/logging.js';
import { EmbedBuilder } from '@discordjs/builders';
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
    refreshInterval: 60000,
    baseLink: '',
    requestParameters: '',
    sites: [],
    subscriberChannels: [],
  },
  twitterConfig: {
    loginInformation: {
      consumerKey: '',
      consumerSecret: '',
      accessToken: '',
      accessTokenSecret: '',
    },
    enabled: true,
    twitterSubscriptions: [],
  },
};

const twitterConfiguration = {
  consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret: '',
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true,
};

Logger.info(`PoENews bot starting`, { label: 'STARTUP' });

loadConfiguration();

client.login(configurationFile.discordBotToken);

globalThis.pathOfExileNews = new PoENews(client, configurationFile.poeConfig);
globalThis.twitterNews = new Twitter(client, configurationFile.twitterConfig);
registerSlashCommands();
registerClientEventHandlers();

pathOfExileNews.start();
twitterNews.start();

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);

function loadConfiguration(): void {
  Logger.info(`Loading configuration`, { label: 'CONFIG' });
  try {
    Object.assign(configurationFile, JSON.parse(fs.readFileSync('./config/settings.json', 'utf-8')));
    twitterConfiguration.consumer_key = configurationFile.twitterConfig.loginInformation.consumerKey;
    twitterConfiguration.consumer_secret = configurationFile.twitterConfig.loginInformation.consumerSecret;
    twitterConfiguration.access_token = configurationFile.twitterConfig.loginInformation.accessToken;
    twitterConfiguration.access_token_secret = configurationFile.twitterConfig.loginInformation.accessTokenSecret;
  } catch (error) {
    Logger.error(`Failed to read configuration file: ${error}`, { label: 'CONFIG' });
  }
}
