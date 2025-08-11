import ReplaceVariables from './ReplaceVariables';
import Translate from './Translate';
import chalk from 'chalk';
import { Logger, createLogger, format, transports } from 'winston';
import { TitleCase } from '../Utils/StringUtils';
import type { LogData } from '../types/main';

const logs: LogData[] = [
  { level: 'discord', background: chalk.bgMagenta, color: chalk.reset.magenta },
  { level: 'other', background: chalk.bgCyan, color: chalk.reset.cyan },
  { level: 'warn', background: chalk.bgRedBright, color: chalk.reset.redBright },
  { level: 'error', background: chalk.bgRedBright, color: chalk.reset.redBright },
  { level: 'max', background: chalk.bgBlack, color: chalk.reset.black }
];

function getCurrentTime() {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZoneName: 'short',
    timeZone: 'UTC'
  });
}

function getErrorString(error: Error): string {
  return `${error.toString()}${error.stack?.replace(error.toString(), '')}`;
}

function logSomething(message: string, log: LogData): void {
  console.log(
    log.background(
      ReplaceVariables(Translate('console'), {
        time: getCurrentTime(),
        level: TitleCase(log.level),
        message: log.color(message)
      })
    )
  );
}

const combinedTransport = new transports.File({ level: 'max', filename: './logs/combined.log' });
const loggers: { [key: string]: Logger } = {};
logs.forEach((log) => {
  loggers[log.level] = createLogger({
    level: log.level,
    levels: logs.reduce(
      (acc, name, index) => {
        acc[name.level] = index;
        return acc;
      },
      {} as Record<string, number>
    ),
    format: format.combine(
      format.printf(({ timestamp, level, message }) => {
        return ReplaceVariables(Translate('console'), { time: getCurrentTime(), level: TitleCase(log.level), message });
      })
    ),
    transports: [new transports.File({ level: log.level, filename: `./logs/${log.level}.log` }), combinedTransport]
  });
});

console.discord = (message: string): void => {
  const log = logs.find((log) => log.level === 'discord') || logs[1];
  loggers[log.level].log(log.level, message);
  return logSomething(message, log);
};

console.other = (message: string): void => {
  const log = logs.find((log) => log.level === 'other') || logs[1];
  loggers[log.level].log(log.level, message);
  return logSomething(message, log);
};

console.warn = (message: string): void => {
  const log = logs.find((log) => log.level === 'warn') || logs[1];
  loggers[log.level].log(log.level, message);
  return logSomething(message, log);
};

console.error = (message: Error): void => {
  const log = logs.find((log) => log.level === 'error') || logs[1];
  loggers[log.level].log(log.level, getErrorString(message));
  return logSomething(getErrorString(message), log);
};
