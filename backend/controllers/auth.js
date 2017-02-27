'use strict';

var genericSession = require('koa-generic-session');

var passport = require('koa-passport');
var GoogleTokenStrategy = require('passport-google-id-token');

var _ = require('lodash');

var database = require('../db/database');
var ClientError = require('../client-error');

var config = require('../config');

var TOKEN_REGEX = /Bearer (.*)/i;

exports.session = genericSession({
  store: database.sessionStore,

  sessionIdStore: {

    get: function() {
      var header = this.header.authorization;
      if(!header) { return; }

      var match = header.match(TOKEN_REGEX);
      if(_.isNull(match)) { return; }

      return match[1];
    },

    set: _.noop,
    reset: _.noop
  }
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  database.User.find({where: {id: id}}).then(
    function(user) {
      done(null, user);
    },
    function(err)  {
      done(err);
    });
});

passport.use(new GoogleTokenStrategy({
    clientID: '692928060586-hdgprhok15rkcpdrkcmh4p3s5m12sdgb.apps.googleusercontent.com'
  },
  function(parsedToken, googleId, done) {
    var profile = parsedToken.payload;

    database.User.find({where: {googleId: googleId}})
      .then(function(user) {
        if (user) { return done(null, user); }

        var email = profile.email;
        var promise;

        if (email) {
          email = email.toLowerCase();
          promise = database.User.find({ where: {email: email} });
        } else {
          promise = new Promise(function(resolve) { resolve(null); });
        }

        promise.then(function(user) {
          var options = { googleId: googleId,
                          firstname: profile.given_name,
                          lastname: profile.family_name };
          
          if(user) {
            return user.updateAttributes(options);
          } else {
            if(email) { options.email = email; }
            return database.User.create(options);
          }
        })

        .then(function(user) {
          done(null, user);
        });
      }
    );
  }
));

function toJSON(user, sessionId) {
  return {
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: sessionId
    }
  };
}

/**
 * @api {post} /api/google/signin Login through Google account
 * @apiVersion 0.0.1
 * @apiName SignInGoogle
 * @apiGroup Auth
 *
 * @apiParam {String} access_token Google access token
 * @apiParam {String} [ refresh_token ] Google refresh token
 */
exports.googleSignIn = function*() {
  yield passport.authenticate('google-id-token').call(this, function*(req) {
    var user = this.passport.user;
    
    this.response.body = toJSON(user, this.sessionId);
    this.status = 200;
  });
};

exports.googleSignInCallback = function*() {
  yield passport.authenticate('google', { failureRedirect: '/login' }).call(this, function*() {
    this.status = 200;
  });
};

/**
 * @api {post} /api/logout Logout current authenticated user
 * @apiVersion 0.0.1
 * @apiName Logout
 * @apiGroup Auth
 */
exports.logout = function() {
  this.logout();
  this.status = 204;
};

/**
 * @api {get} /users/me Current User Info
 * @apiVersion 0.0.1
 * @apiName GetCurrentUser
 * @apiGroup Auth
 * @apiPermission user
 *
 */
exports.current = function *() {
  var user = this.passport.user;
  this.body = yield toJSON(user);
};

exports.authenticatedMiddleware = function *(next) {
  if (!this.isAuthenticated()) {
    throw new ClientError('UNAUTHORIZED', 401);
  }
  yield next;
};
