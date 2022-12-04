export function gracefulShutdown(): void {
  twitterNews.stop();
  pathOfExileNews.stop();
  client?.destroy();
  process.exit(0);
}
