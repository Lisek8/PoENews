import { PathOfExileNewsConfiguration } from "../services/poeNews";
import { TwitterConfiguration } from "../services/twitter";

export interface ApplicationConfiguration {
  discordBotToken: string;
  poeConfig: PathOfExileNewsConfiguration;
  twitterConfig: TwitterConfiguration;
  version?: string;
}
