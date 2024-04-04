import { Client, Collection } from 'discord.js';
import { SlashCommand } from './slash-commands/common';
import { ApplicationConfiguration } from './utilities/dataStructures';

declare global {
  var client: ClientWithCommands;
  var configurationFile: ApplicationConfiguration;
  var pathOfExileNews: PoENews;
}
