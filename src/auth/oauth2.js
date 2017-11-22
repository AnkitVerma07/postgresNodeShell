/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const oauth2orize = require('oauth2orize');
const passport = require('passport');
const login = require('connect-ensure-login');

const tokenUtils = require('../auth/utils/token_utils');
const oauthUtils = require('../auth/utils/oauth_utils');
const RefreshTokenService = require('../services/RefreshTokenService');
const AccessTokenService = require('../services/AccessTokenService');
const OauthClientService = require('../services/OauthClientService');
const UserService = require('../services/UserService');
const UserSessionService = require('../services/UserSessionService');
const constants = require('../utils/constants');
const GenericError = require('../utils/errors').GenericError;

// create OAuth 2.0 server
const server = oauth2orize.createServer();

const Oauth2 = (() => {
  // Exchange user id and password for access tokens.  The callback accepts the
  // `client`, which is exchanging the user's name and password from the
  // authorization request for verification. If these values are validated, the
  // application issues an access token on behalf of the user who authorized the code.
  server.exchange(oauth2orize.exchange.password((client, username, password, scope, reqBody, authInfo, done) => {
    return OauthClientService
      .findByClientId(client.id)
      .then((localClient) => {
        if (!localClient || (localClient.client_secret !== client.client_secret)) {
          return Promise.reject(new oauth2orize.TokenError('Wrong client to grant this user authorities', 'unauthorized_client'));
        }

        // Validate the user, username passed will be the email for the user
        return UserService.fetchFullUserByEmail(username);
      })
      .then((user) => {
        if (!user) {
          return Promise.reject(null);
        }
        // if (client.authorities.indexOf(user.role) < 0) {
        //   return Promise.reject(new oauth2orize.TokenError('Wrong client to grant this user authorities', 'unauthorized_client'));
        // }

        if (!user.checkPassword(password)) {
          return Promise.reject(new oauth2orize.TokenError('Password does not match the one on file', 'unauthorized_client'));
        }

      })
      .then((userSession) => {
        if (!userSession) {
          return Promise.reject(new oauth2orize.TokenError('Unauthorized user session', 'unauthorized_client'));
        }

        return tokenUtils.getTokens(client, userSession, done);
      })
      .catch(err => done(err));
  }));


  // Exchange the refresh token for an access token.
  //
  // The callback accepts the `client`, which is exchanging the client's id from the token
  // request for verification.  If this value is validated, the application issues an access
  // token on behalf of the client who authorized the code
  server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, reqBody, authInfo, done) => {
    // Use the refreshToken value to find the refreshToken in the database
    return RefreshTokenService.fetchWithAccessJoinedUserSession(refreshToken).then((rToken) => {
      if (!rToken || (client.id !== rToken.client_id)) {
        return Promise.reject(null);
      }

      const userSession = rToken.user_session;

      if (!userSession) {
        return Promise.reject(new oauth2orize.TokenError('Unauthorized user session', 'unauthorized_client'));
      }

      // Find and remove the old access and refresh tokens and generate new ones
      return AccessTokenService.deleteTokenSet(rToken.access_token_id).then(() => {
        return tokenUtils.getTokens(client, userSession, done);
      });
    }).catch(err => done(err));
  }));

  // Register serialialization and deserialization functions.
  //
  // When a client redirects a user to user authorization endpoint, an
  // authorization transaction is initiated.  To complete the transaction, the
  // user must authenticate and approve the authorization request.  Because this
  // may involve multiple HTTP request/response exchanges, the transaction is
  // stored in the session.
  //
  // An application must supply serialization functions, which determine how the
  // client object is serialized into the session.  Typically this will be a
  // simple matter of serializing the client's ID, and deserializing by finding
  // the client by ID from the database.
  server.serializeClient(function(client, done) {
    return done(null, client.id);
  });


  server.deserializeClient(function(id, done) {
    OauthClientService.find(id, function(err, client) {
      if (err) {
        return done(err);
      }

      return done(null, client);
    });
  });

  // Register supported grant types.
  //
  // OAuth 2.0 specifies a framework that allows users to grant client
  // applications limited access to their protected resources.  It does this
  // through a process of the user granting access, and the client exchanging
  // the grant for an access token.

  // Grant authorization codes.  The callback takes the `client` requesting
  // authorization, the `redirectURI` (which is used as a verifier in the
  // subsequent exchange), the authenticated `user` granting access, and
  // their response, which contains approved scope, duration, etc. as parsed by
  // the application.  The application issues a code, which is bound to these
  // values, and will be exchanged for an access token.
  server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
    let code = oauthUtils.uid(16);

    db.authorizationCodes.save(code, client.id, redirectURI, user.id, function(err) {
      if (err) {
        return done(err);
      }

      done(null, code);
    });
  }));


  // Exchange authorization codes for access tokens.  The callback accepts the
  // `client`, which is exchanging `code` and any `redirectURI` from the
  // authorization request for verification.  If these values are validated, the
  // application issues an access token on behalf of the user who authorized the
  // code.
  /* server.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
   db.authorizationCodes.find(code, function(err, authCode) {
   if (err) {
   return done(err);
   }

   if (authCode === undefined) {
   return done(null, false);
   }

   if (client.id !== authCode.clientID) {
   return done(null, false);
   }

   if (redirectURI !== authCode.redirectURI) {
   return done(null, false);
   }

   db.authorizationCodes.delete(code, function(err) {
   if (err) {
   return done(err);
   }

   let token = oauthUtils.uid(256);
   db.accessTokens.save(token, authCode.userID, authCode.clientID, function(err) {
   if (err) {
   return done(err);
   }

   done(null, token);
   });
   });
   });
   }));*/

  return {
    // user authorization endpoint
    //
    // `authorization` middleware accepts a `validate` callback which is
    // responsible for validating the client making the authorization request.  In
    // doing so, is recommended that the `redirectURI` be checked against a
    // registered value, although security requirements may vary accross
    // implementations.  Once validated, the `done` callback must be invoked with
    // a `client` instance, as well as the `redirectURI` to which the user will be
    // redirected after an authorization decision is obtained.
    //
    // This middleware simply initializes a new authorization transaction.  It is
    // the application's responsibility to authenticate the user and render a dialog
    // to obtain their approval (displaying details about the client requesting
    // authorization).  We accomplish that here by routing through `ensureLoggedIn()`
    // first, and rendering the `dialog` view.
    authorization: [
      login.ensureLoggedIn(),
      server.authorization((clientID, redirectURI, done) => {
        return OauthClientService.findByClientId(clientID).then((client) => {
          // WARNING: For security purposes, it is highly advisable to check that
          //          redirectURI provided by the client matches one registered with
          //          the server.  For simplicity, this example does not.  You have
          //          been warned.
          return done(null, client, redirectURI);
        }).catch(err => done(err));
      }),
      (req, res) => {
        const authorizationRender =  {
          transactionID: req.oauth2.transactionID,
          user: req.user,
          client: req.oauth2.client,
        };

        return res.render('dialog', authorizationRender);
      },
    ],


    // user decision endpoint
    //
    // `decision` middleware processes a user's decision to allow or deny access
    // requested by a client application.  Based on the grant type requested by the
    // client, the above grant middleware configured above will be invoked to send
    // a response.
    decision: [
      login.ensureLoggedIn(),
      server.decision(),
    ],


    // token endpoint
    //
    // `token` middleware handles client requests to exchange authorization grants
    // for access tokens.  Based on the grant type being exchanged, the above
    // exchange middleware will be invoked to handle the request.  Clients must
    // authenticate when making requests to this endpoint.
    token: [
      passport.authenticate(['basic', 'oauth2-client-password']),
      (req, res, next) => {
        // Pass the sessionId into the req.authInfo to be usable later in the oauth2orize exchange.
        req.authInfo = { sessionId: req.sessionID };
        next();
      },
      server.token(),
      server.errorHandler(),
    ],
  };
})();

module.exports = Oauth2;
