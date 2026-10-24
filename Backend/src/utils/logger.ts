/**
 * Simple logger utility using console with timestamps
 * Can be swapped with winston or pino in production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const getTimestamp = (): string => new Date().toISOString();

const formatMessage = (level: LogLevel, message: string): string => {
  const levels: Record<LogLevel, string> = {
    info:  '\x1b[36m[INFO] \x1b[0m',
    warn:  '\x1b[33m[WARN] \x1b[0m',
    error: '\x1b[31m[ERROR]\x1b[0m',
    debug: '\x1b[35m[DEBUG]\x1b[0m',
  };
  return `${getTimestamp()} ${levels[level]} ${message}`;
};

const logger = {
  info: (message: string): void => {
    console.log(formatMessage('info', message));
  },
  warn: (message: string): void => {
    console.warn(formatMessage('warn', message));
  },
  error: (message: string): void => {
    console.error(formatMessage('error', message));
  },
  debug: (message: string): void => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage('debug', message));
    }
  },
};

export default logger;
