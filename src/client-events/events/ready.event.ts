import { ActivityType } from 'discord.js';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc.js';
import timezonePlugin from 'dayjs/plugin/timezone.js';
import leagueInfo from '../../app-data/league-info.json' assert { type: 'json' };

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

export function registerReadyEventHandler(): void {
  client.on('ready', () => {
    setActivity();
  });
}

function setActivity(): void {
  if (client.user) {
    const diffSeconds = dayjs(leagueInfo.leagueStartDate).diff(dayjs(), 'seconds');

    if (diffSeconds > 0) {
      const minutes = Math.floor(diffSeconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      const hoursForActivity = hours - days * 24;
      const minutesForActivity = minutes - hours * 60;
      const secondsForActivity = diffSeconds - minutes * 60;

      const activityString = `${days > 0 ? `${days} d ` : ''} ${hoursForActivity > 0 || days ? `${hoursForActivity} h ` : ''} ${
        minutesForActivity > 0 || days || hoursForActivity ? `${minutesForActivity} m ` : ''
      } ${secondsForActivity} s`;

      client.user.setActivity(activityString, { type: ActivityType.Playing });

      setTimeout(setActivity, 15000);
    } else {
      client.user.setActivity(configurationFile.version ? configurationFile.version : 'DEV_BUILD', {
        type: ActivityType.Playing,
      });

      setTimeout(setActivity, 10800000);
    }
  }
}
