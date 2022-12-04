import { Client, Collection } from 'discord.js';
import { SlashCommand } from '../slash-commands/common';
import { PathOfExileNewsConfiguration } from '../services/poeNews';
import { TwitterConfiguration } from '../services/twitter';

export type ClientWithCommands = Client & { commands: Collection<string, SlashCommand> };

export interface ApplicationConfiguration {
  discordBotToken: string;
  discordApplicationId: string;
  poeConfig: PathOfExileNewsConfiguration;
  twitterConfig: TwitterConfiguration;
  version?: string;
}
