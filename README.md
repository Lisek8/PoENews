# PoENews

## Initial idea

Simple discord bot webscraping news from forums of a game called [PathOfExile](https://www.pathofexile.com/) created by Grinding Gear Games. Worked on by me whenever I could find enough time and will do write it and then hosted on Raspberry Pi.

## Development over time

- Rewrote config and logic to allow posting same news to multiple channels
- ~~Added support for subscribing to twitter streams and posting them to a discord channels specified in config file~~ (Removed due to twitter api changes)
- ~~Slightly prepared the app for dynamic management of twitter subscriptions and 'PoE forums' subscriptions~~ (Removed due to twitter api changes)
- Containerization through usage of Docker
- Support for PoE2
- Split to microservice architecture
  - News api (Non public as for now - written in C#)
  - Discord bot api consumer

### Hidden due presensce of ip, keys, etc..
- Script used for automated deployment of docker container in various contexts
- Development and production configs

### Ideas for future
- Rewrite to C#
- Dynamic subscription management
- Dynamic

## Environemnt
- [Node.js](https://nodejs.org/en/) - 18
- [Docker](https://www.docker.com/) - 25.0.3

### Libaries
- [discord.js](https://www.npmjs.com/package/discord.js)
- [got](https://www.npmjs.com/package/got)
- [winston](https://www.npmjs.com/package/winston)
- [dayjs](https://www.npmjs.com/package/dayjs)
