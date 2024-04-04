export function gracefulShutdown(): void {
  pathOfExileNews.stop();
  client?.destroy();
  process.exit(0);
}
