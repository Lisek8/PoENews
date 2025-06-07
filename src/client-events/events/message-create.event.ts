import { EmbedBuilder, Message } from 'discord.js';
import leagueInfo from '../../app-data/league-info.json' assert { type: 'json' };

export function registerMessageCreateEventHandler(): void {
  client.on('messageCreate', (message: Message<boolean>) => {
    const leagueWhenStrings: string[] = [
      'leaguewhen',
      'howmanydaystillnewleague',
      'newleaguewhen',
      'whendoesnewleaguestart',
      'leaguestartwhen',
    ];

    let messageContent = message.content.replace(/[^a-z]/gi, '').toLowerCase();

    if (leagueWhenStrings.some((leagueWhenString: string) => messageContent.startsWith(leagueWhenString))) {

      const embed = new EmbedBuilder()
        .setColor(0x530191)
        .setTitle(leagueInfo.leagueName)
        .addFields({
          name: 'League start',
          value: `<t:${new Date(leagueInfo.leagueStartDate).getTime() / 1000}:R>`,
        });

      message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
    }
  });
}
