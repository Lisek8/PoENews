import { Client, MessageEmbed, TextChannel } from "discord.js";
import got from "got/dist/source";
import { HTMLElement, parse } from "node-html-parser";
import { Logger } from "../utilities/logging";
import fs from "fs";

export interface PathOfExileNewsConfiguration {
  enabled: boolean;
  refreshInterval: number;
  baseLink: string;
  requestParameters: string;
  sites: string[];
  subscriberChannels: string[];
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
  private _lastUpdateFile = "lastUpdate";
  private _running: boolean = false;

  constructor (discordClient: Client, configuration: PathOfExileNewsConfiguration) {
    this._discordClient = discordClient;
    this._configuration = configuration;
    this._lastUpdateDate = new Date();
    Logger.info(`Creating PoENews instance`, { label: 'POE' });
  }

  private loadLastUpdateDate(): void {
    try {
      if (fs.existsSync(this._lastUpdateFile)) {
        this._lastUpdateDate = new Date(fs.readFileSync(this._lastUpdateFile, "utf-8"));
      } else {
        this._lastUpdateDate = new Date();
        this.saveLastUpdateDate();
      }
    } catch(error) {
      Logger.error(`Failed read/write to last update file: ${error}`, { label: 'I/O' });
    }
  }

  private saveLastUpdateDate(): void {
    try {
      fs.writeFileSync(this._lastUpdateFile, this._lastUpdateDate.toUTCString());
    } catch(error) {
      Logger.error(`Failed write to last update file: ${error}`, { label: 'I/O' });
    }
  }

  private async getNews(): Promise<News[]> {
    const newsToPost = [];
    for (let forumPageId of this._configuration.sites) {
      try {
        const response = await got(`${this._configuration.baseLink}${forumPageId}${this._configuration.requestParameters}`);
        const document = parse(response.body);
        const breadcrumbChildNodes = document.querySelector(".breadcrumb").childNodes;
        const forumTitle = breadcrumbChildNodes[breadcrumbChildNodes.length - 1].textContent;
        for (let thread of document.querySelectorAll("table")[0].querySelectorAll("tbody")[0].querySelectorAll("tr")) {
          try {
            if (thread.innerHTML.includes("sticky") != true) {
              const news: News = {
                forumTitle: forumTitle,
                postBy: thread.querySelector(".post_by_account").text.trim(),
                postDate: new Date(thread.querySelector(".post_date").rawText),
                title: thread.querySelector(".title").text.trim(),
                link: "https://www.pathofexile.com" + (thread.querySelector(".title").childNodes[1] as HTMLElement).attributes.href
              };
              if (news.postDate > this._lastUpdateDate) {
                newsToPost.push(news);
              }
            }
          } catch (error) {
            Logger.error(`An error occured while trying to get required data: ${error}`, { label: 'POE' });
          }
        }
      } catch (error: any) {
        if (error.response?.code) {
          Logger.error(`Http request failed with code: ${error.response.code}`, { label: 'POE' });
        }
        Logger.warn(`Highly likely that website is under maintenance!`, { label: 'POE' });  
      }
    }
    return newsToPost;
  }

  private sendPoENews(news: News): void {
    const embed = new MessageEmbed()
      .setAuthor({
        name: news.forumTitle,
        iconURL: 'https://web.poecdn.com/image/favicon/ogimage.png'
      })
      .setTitle(news.title)
      .setURL(news.link)
      .setTimestamp(news.postDate)
      .setFooter({
        text: `${news.postBy}`
      });

    this._configuration.subscriberChannels.forEach(subscriberChannel => {
      const channel = this._discordClient.channels.cache.get(subscriberChannel) as TextChannel;
      channel.send({
        embeds: [
          embed
        ]
      });
    });
  }

  private async checkNews(): Promise<void> {
    this.loadLastUpdateDate();
    const newUpdateDate = new Date();
    const newsToPost: News[] = await this.getNews();
  
    // Order news by date
    newsToPost.sort((news1, news2) => {
      if (news1.postDate < news2.postDate) {
        return -1;
      }
      if (news1.postDate > news2.postDate) {
        return 1;
      }
      return 0;
    });
  
    // Send news to discord
    this._lastUpdateDate = newUpdateDate;
    try {
      for (let news of newsToPost) {
        this.sendPoENews(news);
        this._lastUpdateDate = news.postDate;
      }
    } catch (error) {
      Logger.error(`Failed to send news: ${error}`, { label: 'POE' });
    }
    this.saveLastUpdateDate();
  }

  public start(): void {
    if (this._running) {
      Logger.warn(`PoENews already running`, { label: 'POE' });
      return;
    }
    Logger.info(`Starting PoENews`, { label: 'POE' });
    if (this._configuration.enabled) {
      this._running = true;
      this.checkNews();
      this._refreshInterval = setInterval(this.checkNews.bind(this), this._configuration.refreshInterval);
    } else {
      Logger.warn(`PoE news are disabled!`, { label: 'POE' });
    }
  }

  public stop(): void {
    if (!this._running) {
      Logger.info(`PoENews is already stopped`, { label: 'POE' });
      return;
    }
    Logger.info(`Stopping PoENews`, { label: 'POE' });
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
    }
    this._running = false;
  }

  public get configuration(): PathOfExileNewsConfiguration {
    return this._configuration;
  }

  public set subscriptions(config: PathOfExileNewsConfiguration)  {
    this._configuration = config;
    // WEBUI: Configuration manager save file
    // WEBUI: Recreate timeout with setInterval if interval changed
    // WEBUI: Decide on fate depending on what changed :blobSweat:
  }
}