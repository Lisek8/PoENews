import { Client, EmbedBuilder, roleMention, TextChannel } from 'discord.js';
import { Logger } from '../utilities/logging.js';
import fs from 'fs';
import got from 'got';
import { LogSource } from '../utilities/dataStructures.js';

export interface PathOfExileNewsConfiguration {
  enabled: boolean;
  newsServer: string;
  refreshInterval: number;
  poeOneSubscriberChannels: string[];
  poeTwoSubscriberChannels: string[];
}

interface News {
  forumTitle: string;
  postBy: string;
  postDate: Date;
  title: string;
  link: string;
}

export class PoENews {
  private _discordClient: Client;
  private _configuration: PathOfExileNewsConfiguration;
  private _refreshInterval: NodeJS.Timeout | undefined;
  private _lastUpdateDate: Date;
  private _lastUpdateFile = 'data/lastUpdate';
  private _running: boolean = false;

  constructor(discordClient: Client, configuration: PathOfExileNewsConfiguration) {
    this._discordClient = discordClient;
    this._configuration = configuration;
    this._lastUpdateDate = new Date();
    Logger.info(`Creating PoENews instance`, { label: LogSource.POE });
  }

  private loadLastUpdateDate(): void {
    try {
      if (fs.existsSync(this._lastUpdateFile)) {
        this._lastUpdateDate = new Date(fs.readFileSync(this._lastUpdateFile, 'utf-8'));
      } else {
        this._lastUpdateDate = new Date();
        this.saveLastUpdateDate();
      }
    } catch (error) {
      Logger.error(`Failed read/write to last update file: ${error}`, { label: LogSource.IO });
    }
  }

  private saveLastUpdateDate(): void {
    try {
      fs.writeFileSync(this._lastUpdateFile, this._lastUpdateDate.toISOString());
    } catch (error) {
      Logger.error(`Failed write to last update file: ${error}`, { label: LogSource.IO });
    }
  }

  private async getPoeOneNews(): Promise<News[]> {
    let newsToPost: News[] = [];

    try {
      const response = await got(`${this._configuration.newsServer}/api/PoeNews`);

      const newsFromBackend: News[] = JSON.parse(response.body);

      newsToPost = newsFromBackend.map((news) => {
        news.postDate = new Date(news.postDate);

        return news;
      }).filter((news) => news.postDate > this._lastUpdateDate);
    } catch (error: any) {
      Logger.error(error, { label: LogSource.POE})
      Logger.warn(`Highly likely that website is under maintenance!`, { label: LogSource.POE });
    }

    return newsToPost;
  }

  private async getPoeTwoNews(): Promise<News[]> {
    let newsToPost: News[] = [];

    try {
      const response = await got(`${this._configuration.newsServer}/api/Poe2News`);

      const newsFromBackend: News[] = JSON.parse(response.body);

      newsToPost = newsFromBackend.map((news) => {
        news.postDate = new Date(news.postDate);

        return news;
      }).filter((news) => news.postDate > this._lastUpdateDate);
    } catch (error: any) {
      if (error.response?.code) {
        Logger.error(`Http request failed with code: ${error.response.code}`, { label: LogSource.POE });
      }

      Logger.warn(`Highly likely that website is under maintenance!`, { label: LogSource.POE });
    }

    return newsToPost;
  }

  private sendPoENews(news: News, subscriberChannelList: string[]): void {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: news.forumTitle,
        iconURL: 'https://web.poecdn.com/public/news/2025-05-21/POELogoSecretsoftheAtlas.png',
      })
      .setTitle(news.title)
      .setURL(news.link)
      .setTimestamp(news.postDate)
      .setFooter({
        text: `${news.postBy}`,
      });

      subscriberChannelList.forEach((subscriberChannel) => {
      const channel = this._discordClient.channels.cache.get(subscriberChannel) as TextChannel;
      channel.send({
        embeds: [embed],
      });
    });
  }

  private async checkNews(): Promise<void> {
    this.loadLastUpdateDate();
    const poeOneNewsToPost: News[] = await this.getPoeOneNews();
    const poeTwoNewsToPost: News[] = await this.getPoeTwoNews();

    let lastPoeOneUpdateDate: Date = this._lastUpdateDate;

    try {
      Logger.info(`PoE news found: ${poeOneNewsToPost.length}`, { label: LogSource.POE });

      for (let news of poeOneNewsToPost.reverse()) {
        this.sendPoENews(news, this._configuration.poeOneSubscriberChannels);
        lastPoeOneUpdateDate = news.postDate;
      }
    } catch (error) {
      Logger.error(`Failed to send news: ${error}`, { label: LogSource.POE });
    }

    let lastPoeTwoUpdateDate: Date = this._lastUpdateDate;

    try {
      Logger.info(`PoE2 news found: ${poeTwoNewsToPost.length}`, { label: LogSource.POE });
      
      for (let news of poeTwoNewsToPost.reverse()) {
        this.sendPoENews(news, this._configuration.poeTwoSubscriberChannels);
        lastPoeTwoUpdateDate = news.postDate;
      }
    } catch (error) {
      Logger.error(`Failed to send news: ${error}`, { label: LogSource.POE });
    }

    this._lastUpdateDate = lastPoeOneUpdateDate > lastPoeTwoUpdateDate ? lastPoeOneUpdateDate : lastPoeTwoUpdateDate;

    this.saveLastUpdateDate();
  }

  public start(): void {
    if (this._running) {
      Logger.warn(`PoENews already running`, { label: LogSource.POE });
      return;
    }

    Logger.info(`Starting PoENews`, { label: LogSource.POE });

    if (this._configuration.enabled) {
      this._running = true;
      this.checkNews();
      this._refreshInterval = setInterval(() => this.checkNews(), this._configuration.refreshInterval);
    } else {
      Logger.warn(`PoE news are disabled!`, { label: LogSource.POE });
    }
  }

  public stop(): void {
    if (!this._running) {
      Logger.info(`PoENews is already stopped`, { label: LogSource.POE });
      return;
    }

    Logger.info(`Stopping PoENews`, { label: LogSource.POE });

    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
    }

    this._running = false;
  }

  public announce(channelId: string, message: string, roleId?: string): void {
    const channel = this._discordClient.channels.cache.get(channelId) as TextChannel;
    const mention = roleId ? roleMention(roleId) : '';

    channel.send(`${mention} ${message}`);
  }
}
