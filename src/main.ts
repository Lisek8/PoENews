import { Client, Intents } from 'discord.js';
import fs from 'fs';
import { ApplicationConfiguration } from './utilities/dataStructures';
import { Logger } from './utilities/logging';
import { PoENews } from './services/poeNews';
import { Twitter } from './services/twitter';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const configurationFile: ApplicationConfiguration = {
  discordBotToken: '',
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
const pathOfExileNews: PoENews = new PoENews(client, configurationFile.poeConfig);
const twitterNews: Twitter = new Twitter(client, configurationFile.twitterConfig);

client.on('ready', () => {
  setActivity();
  setInterval(setActivity, 10800000);
});

pathOfExileNews.start();
twitterNews.start();

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);

function setActivity() {
  if (client.user) {
    client.user.setActivity(configurationFile.version ? configurationFile.version : 'DEV_BUILD', { type: 'PLAYING' });
  }
}

function loadConfiguration() {
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

function gracefulShutdown() {
  twitterNews.stop();
  pathOfExileNews.stop();
  client?.destroy();
  process.exit(0);
}
