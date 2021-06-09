import { Client, TextChannel } from "discord.js";
import Twit from "twit";
import { Logger } from "./logging";

export interface TwitterLoginConfiguration {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export interface TwitterSubscription {
  enabled: boolean;
  name: string;
  channelId: string;
  subscriberChannels: string[];
}

export interface TwitterConfiguration {
  loginInformation: TwitterLoginConfiguration;
  enabled: boolean;
  twitterSubscriptions: TwitterSubscription[];
}

interface InternalTwitterLoginConfiguration {
  consumer_key: string,
  consumer_secret: string,
  access_token: string,
  access_token_secret: string,
  timeout_ms: number,
  strictSSL: boolean
}

export class Twitter {
  private _discordClient: Client;
  private _configuration: TwitterConfiguration;
  private _twitterClient: Twit | undefined;
  private _twitterStreams: Twit.Stream[] = [];
  private _running: boolean = false;

  constructor (discordClient: Client, configuration: TwitterConfiguration) {
    this._discordClient = discordClient;
    this._configuration = configuration;
    
    Logger.info(`Creating Twitter instance`, { label: 'TWITTER' });
  }

  private createTwitterStreams() {
    if (this._configuration.enabled) {
      Logger.info(`Creating twitter streams`, { label: 'TWITTER' });
      this._configuration.twitterSubscriptions.forEach(subscription => {
        const twitterStream: Twit.Stream | undefined = this._twitterClient?.stream("statuses/filter", {
          follow: subscription.channelId
        });

        if (twitterStream != null) {
          Logger.info(`Successfully created stream for: ${subscription.name}`, { label: 'TWITTER' });

          twitterStream.on("tweet", (tweet) => {
            if (tweet.user.screen_name === subscription.name && (!tweet.in_reply_to_user_id_str || tweet.in_reply_to_user_id_str === subscription.channelId)) {
              subscription.subscriberChannels.forEach(channelId => {
                const channel = this._discordClient.channels.cache.get(channelId) as TextChannel;
                channel.send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
              });
            }
          });
          this._twitterStreams.push(twitterStream);
        }
      });
    } else {
      Logger.warn(`Twitter subscriptions disabled!`, { label: 'TWITTER' });
    }
  }

  public start(): void {
    if (this._running) {
      Logger.warn(`Twitter already running`, { label: 'TWITTER' });
      return;
    }
    Logger.info(`Starting Twitter`, { label: 'TWITTER' });
    Logger.info(`Logging in to Twitter`, { label: 'TWITTER' });
    if (this._configuration.enabled) {
      const loginConfiguration: InternalTwitterLoginConfiguration = {
        consumer_key: this._configuration.loginInformation.consumerKey,
        consumer_secret: this._configuration.loginInformation.consumerSecret,
        access_token: this._configuration.loginInformation.accessToken,
        access_token_secret: this._configuration.loginInformation.accessTokenSecret,
        timeout_ms: 60000,
        strictSSL: true
      }
      this._running = true;
      this._twitterClient = new Twit(loginConfiguration);
      this.createTwitterStreams();
    } else {
      Logger.warn(`Twitter is disabled!`, { label: 'TWITTER' });
    }
  }

  public stop(): void {
    if (!this._running) {
      Logger.info(`Twitter is already stopped`, { label: 'TWITTER' });
      return;
    }
    Logger.info(`Stopping Twitter`, { label: 'TWITTER' });
    this._twitterStreams.forEach((stream: Twit.Stream) => {
      stream.stop();
    });
    this._twitterStreams = [];
    this._running = false;
  }

  public enable(): void {
    this._configuration.enabled = true;
    // WEBUI: Configuration manager save config to file
    this.start();
  }

  public disable(): void {
    this._configuration.enabled = false;
    // WEBUI: Configuration manager save config to file
    this.stop();
  }

  public get configuration(): TwitterConfiguration {
    return this._configuration;
  }
  public set configuration(config: TwitterConfiguration) {
    // WEBUI: Restart whole twitter and reload config
    this._configuration = config;
  }

  public set subscriptions(subscriptions: TwitterSubscription[]) {
    // WEBUI: Check which subscriptions to stop / start
    this._configuration.twitterSubscriptions = subscriptions;
  }
}