import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc.js';
import timezonePlugin from 'dayjs/plugin/timezone.js';
import { EmbedBuilder, Message } from 'discord.js';
import leagueInfo from '../../app-data/league-info.json' assert { type: 'json' };

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

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
      const leagueStartDate = dayjs(leagueInfo.leagueStartDate);
      const dateFormat = 'DD-MM-YYYY HH:mm';
      const scotlandDateFormat = 'DD-MM-YYYY hh:mmA';

      const embed = new EmbedBuilder()
        .setColor(0x530191)
        .setTitle(leagueInfo.leagueName)
        .addFields({
          name: 'League start',
          value: [
            `:flag_pl: - ${leagueStartDate.tz('Europe/Warsaw').format(dateFormat)}`,
            `:flag_gb: - ${leagueStartDate.tz('Europe/London').format(dateFormat)}`,
            `:scotland: - ${leagueStartDate.tz('Europe/London').format(scotlandDateFormat)}`,
            `:flag_ro: - ${leagueStartDate.tz('Europe/Bucharest').format(dateFormat)}`,
            `:flag_it: - ${leagueStartDate.tz('Europe/Rome').format(dateFormat)}`,
          ].join('\n'),
        });

      message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
    }
  });
}
