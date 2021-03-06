'use strict';

var sequelizeStore = require('koa-session-sequelize');

var config = require('../config');
var sequelize = require('./sequelize');

var User = exports.User = require('./user');

exports.sessionStore = sequelizeStore.create(sequelize, {
  table: 'sessions',
  model: 'Session',
  expires: config.COOKIE_MAX_AGE
});

exports.sync = function(options) {
  return sequelize.sync(options);
};

exports.transaction = function(options) {
  return sequelize.transaction(options);
};
