# PoENews

## Initial idea

Simple discord bot webscraping news from forums of a game called [PathOfExile](https://www.pathofexile.com/) created by Grinding Gear Games. Worked on by me whenever I could find enough time and will do write it and then hosted on Raspberry Pi.

## Development over time

- Rewrote config and logic to allow posting same news to multiple channels
- Added support for subscribing to twitter streams and posting them to a discord channels specified in config file
  - Currently slightly bugged and more news get posted than supposed to (not from person specified in config)
- Slightly prepared the app for dynamic management of twitter subscriptions and 'PoE forums' subscriptions
- Containerization through usage of Docker

### Hidden due presensce of ip, keys, etc..
- ~~Script allowing automated deployment to personal Raspberry Pi through usage of SCP and SSH~~ (no longer used)
- Script used for automated deployment of docker container in various contexts
- Development and production configs

## Plans for future
GUI made to dynamically add/delete/modify any of the subscriptions made in [Angular](https://angular.io/)

## Environemnt
- [Node.js](https://nodejs.org/en/) -  16.16.0
- [Docker](https://www.docker.com/) - 20.10.17

### Libaries
- [discord.js](https://www.npmjs.com/package/discord.js)
- [got](https://www.npmjs.com/package/got)
- [node-html-parser](https://www.npmjs.com/package/node-html-parser)
- [twit](https://www.npmjs.com/package/twit)
- [winston](https://www.npmjs.com/package/winston)
