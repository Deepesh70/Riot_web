/**
 * Production-Grade Structured Logger Utility
 */
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const CURRENT_LEVEL = process.env.NODE_ENV === 'production' 
  ? LOG_LEVELS.INFO 
  : LOG_LEVELS.DEBUG;

function formatLog(level, message, metadata = {}) {
  const timestamp = new Date().toISOString();
  return JSON.stringify({
    timestamp,
    level,
    message,
    ...metadata,
  });
}

export const logger = {
  debug: (message, metadata) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
      console.debug(formatLog('DEBUG', message, metadata));
    }
  },
  info: (message, metadata) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
      console.log(formatLog('INFO', message, metadata));
    }
  },
  warn: (message, metadata) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(formatLog('WARN', message, metadata));
    }
  },
  error: (message, metadata) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
      console.error(formatLog('ERROR', message, metadata));
    }
  },
};

export default logger;
