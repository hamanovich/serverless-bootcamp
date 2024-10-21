import pino from 'pino';

export default pino({
  name: 'auction-service',
  level: process.env.STAGE === 'dev' ? 'debug' : 'warn',
  formatters: {
    level: (label) => ({
      level: label.toUpperCase(),
    }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
