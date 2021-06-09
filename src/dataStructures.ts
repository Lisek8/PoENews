import { PathOfExileNewsConfiguration } from "./poeNews";
import { TwitterConfiguration } from "./twitter";

export interface ApplicationConfiguration {
  discordBotToken: string;
  poeConfig: PathOfExileNewsConfiguration;
  twitterConfig: TwitterConfiguration;
  version?: string;
}
