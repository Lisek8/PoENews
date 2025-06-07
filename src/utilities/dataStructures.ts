import { Client, Collection } from 'discord.js';
import { SlashCommand } from '../slash-commands/common';
import { PathOfExileNewsConfiguration } from '../services/poeNews';

export enum LogSource {
  STARTUP = 'STARTUP',
  CONFIG = 'CONFIG',
  COMMANDS = 'COMMANDS',
  IO = 'I/O',
  POE = 'PoE'
}

export type ClientWithCommands = Client & { commands: Collection<string, SlashCommand> };

export interface ApplicationConfiguration {
  discordBotToken: string;
  discordApplicationId: string;
  poeConfig: PathOfExileNewsConfiguration;
  version?: string;
}
