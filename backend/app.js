'use strict';

var koa = require('koa');

var logger = require('koa-logger');

var cors = require('kcors');
var passport = require('koa-passport');
var bodyParser = require('koa-bodyparser');
var Router = require('koa-router');
var validate = require('koa-validate');

var config = require('./config');

var auth = require('./controllers/auth');

var errorMiddleware = require('./client-error').middleware;

var app = module.exports = koa();

app.use(errorMiddleware);

if (config.LOGGING) {
  app.use(logger());
}

app.keys = config.KEYS;
app.use(auth.session);

app.use(bodyParser());
validate(app);

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

var publicRouter = new Router({prefix: '/api'});
publicRouter.post('/google/signin', auth.googleSignIn);
publicRouter.get('/logout', auth.logout);

app.use(publicRouter.middleware());

var privateRouter = new Router({prefix: '/api'});
privateRouter.get('/users/me', auth.current);

app.use(privateRouter.middleware());

