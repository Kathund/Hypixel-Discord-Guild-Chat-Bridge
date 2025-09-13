import MiscConfig from '../Config/Configs/MiscConfig.js';
import StringOption from '../Config/Options/String.js';
import Translate from './Translate.js';
import chalk from 'chalk';
import { Logger, createLogger, format, transports } from 'winston';
import { ReplaceVariables, TitleCase } from '../Utils/StringUtils.js';
import type { LogData } from '../Types/Misc.js';

const otherLog = { level: 'other', background: chalk.bgCyan.black, color: chalk.reset.cyan };

const logs: LogData[] = [
  { level: 'minecraft', background: chalk.bgGreen.black, color: chalk.reset.green },
  { level: 'discord', background: chalk.bgMagenta.black, color: chalk.reset.magenta },
  otherLog,
  { level: 'warn', background: chalk.bgYellow.black, color: chalk.reset.yellow },
  { level: 'error', background: chalk.bgRedBright.black, color: chalk.reset.redBright },
  { level: 'max', background: chalk.bgBlack.black, color: chalk.reset.black }
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
    timeZone: (new MiscConfig().getValue('timezone') || new StringOption('UTC')).getValue() as string
  });
}

function getErrorString(error: Error): string {
  return `${error.toString()}${error.stack
    ?.replaceAll(error.toString(), '')
    .replaceAll('Hypixel Discord Guild Bridge:', '\nHypixel Discord Guild Bridge:')}`;
}

function logSomething(message: string, log: LogData): void {
  // eslint-disable-next-line
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

console.minecraft = (message: string): void => {
  const log = logs.find((log) => log.level === 'minecraft') || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger) logger.log(log.level, message);
};

console.discord = (message: string): void => {
  const log = logs.find((log) => log.level === 'discord') || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger) logger.log(log.level, message);
};

console.other = (message: string): void => {
  const log = logs.find((log) => log.level === 'other') || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger) logger.log(log.level, message);
};

console.warn = (message: string): void => {
  const log = logs.find((log) => log.level === 'warn') || otherLog;
  logSomething(message, log);
  const logger = loggers[log.level];
  if (logger) logger.log(log.level, message);
};

console.error = (message: Error): void => {
  const log = logs.find((log) => log.level === 'error') || otherLog;
  const errorString = getErrorString(message);
  logSomething(errorString, log);
  const logger = loggers[log.level];
  if (logger) logger.log(log.level, errorString);
};
