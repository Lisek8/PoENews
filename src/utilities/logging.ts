import { createLogger, format, transports } from 'winston';

const loggingFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const Logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    loggingFormat
  ),
  transports: [
    new transports.Console()
  ]
});