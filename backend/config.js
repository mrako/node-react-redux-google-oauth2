'use strict';

module.exports = {
  PORT: process.env.PORT || 9000,
  KEYS: ['really secret key'],
  DEFAULT_LIMIT: 100,
  COOKIE_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days
  LOGGING: process.env.LOGGING || false,
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://example:example@localhost/example',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || ''
};
