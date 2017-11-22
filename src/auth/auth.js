/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const OauthClientService = require('../services/OauthClientService');
const AccessTokenService = require('../services/AccessTokenService');
const UserService = require('../services/UserService');
const UserSessionService = require('../services/UserSessionService');
const AuthError = require('../utils/errors').AuthError;

const Auth = (() => {


  passport.serializeUser(function(user, done) {
    done(null, user.id || 'blah');
  });


  passport.deserializeUser(function(id, done) {
    // User.findById(id, function (err, user) {
    done(null, id);
    // });
  });

  /**
   * BasicStrategy & ClientPasswordStrategy
   *
   * These strategies are used to authenticate registered OAuth clients.  They are
   * employed to protect the `token` endpoint, which consumers use to obtain
   * access tokens.  The OAuth 2.0 specification suggests that clients use the
   * HTTP Basic scheme to authenticate.  Use of the client password strategy
   * allows clients to send the same credentials in the request body (as opposed
   * to the `Authorization` header).  While this approach is not recommended by
   * the specification, in practice it is quite common.
   */
  passport.use(new BasicStrategy(
    (username, password, done) => {
      return OauthClientService.findByClientName(username)
        .then((client) => {
          if (!client) {
            return done(new AuthError(4100, 'Unauthorized: Invalid authorization client'));
            // return done(null, false);
          }

          if (client.client_secret !== password) {
            return done(new AuthError(4101, 'Unauthorized: Invalid authorization client credentials'));
            // return done(null, false);
          }

          return done(null, client);
        })
        .catch(err => done(err));
    }));


  /**
   * BearerStrategy
   *
   * This strategy is used to authenticate users based on an access token (aka a
   * bearer token).  The user must have previously authorized a client
   * application, which is issued an access token to make requests on behalf of
   * the authorizing user.
   */
  passport.use('accessToken', new BearerStrategy(
    (accessToken, done) => {
      return AccessTokenService.fetchByToken(accessToken)
        .then((token) => {
          if (!token) {
            return done(new AuthError(4001, 'Unauthorized: Invalid Access Token', 401), false);
          }

          // Check if the access token has expired and return false if expired
          if (Date.now() > new Date(token.date_expired)) {
            return done(new AuthError(4002, 'Unauthorized: AccessToken expired.', 401), false);
          }

          return UserSessionService.fetchUserBySessionId(token.user_session_id)
            .then((userSession) => {
              if (!userSession || !userSession.user) {
                return done(new AuthError(4003, 'Unauthorized: User does not exist'), false);
              }

              const user = userSession.user;

              // Get the client information to pass through to the endpoint protected to further
              // determine if the user has the proper authorities to access the endpoint
              return OauthClientService.findByClientId(token.client_id)
                .then((client) => {
                  if (!client) {
                    return done(new AuthError(4004, 'Unauthorized: Not a valid auth source'));
                  }

                  const info = {
                    scope: '*',
                    authorities: client.authorities,
                    sessionId: userSession.session_id,
                  };

                  return done(null, user, info);
                });
            });
        })
        .catch(err => done(err));
    }));
})();

module.exports = Auth;
