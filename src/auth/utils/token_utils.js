/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';


const config = require('../config');
const utils = require('./oauth_utils');
const AccessTokenService = require('../../services/AccessTokenService');

const TokenUtils = (() => {
  const sendTokenResponse = (accessToken, cb) => {
    // calculate the amount of seconds until the token expires
    const expiresInSec = Math.floor((accessToken.date_expired.getTime() - Date.now()) / 1000);
    return cb(null, accessToken.token, accessToken.refresh_token.token, { expires_in: expiresInSec });
  };

  const genTokens = (client, userSession) => {
    const tokenValue = utils.uid(config.token.accessTokenLength);
    const refreshTokenValue = utils.uid(config.token.refreshTokenLength);

    // figure out the expiration date of an access token based on the client properties
    let expirationDate = null;
    if (client.token_validity_seconds) {
      expirationDate = config.token.calculateExpirationDate(client.token_validity_seconds);
    }

    // Start RethinkDB implementation
    const refreshToken = {
      token: refreshTokenValue,
      client_id: client.id,
      user_session_id: userSession.id,
    };

    const accessToken = {
      token: tokenValue,
      user_session_id: userSession.id,
      client_id: client.id,
      date_expired: expirationDate,
    };

    return AccessTokenService.saveTokenSet(accessToken, refreshToken);
  };

  return {
    generateTokens: genTokens,

    getTokens: (localClient, userSession, done) => {
      return AccessTokenService.fetchByUserSessionId(userSession.id).then((accessToken) => {
        if (!accessToken) {
          return genTokens(localClient, userSession).then((genAccessToken) => {
            return sendTokenResponse(genAccessToken, done);
          }).catch(err => done(err));
        }

        // Access token exists
        // check if the access token retrieved has expired
        if (Date.now() < new Date(accessToken.date_expired)) {
          return sendTokenResponse(accessToken, done);
        }

        // Remove the access and refresh token
        return AccessTokenService.deleteTokenSet(accessToken.id).then((result) => {
          // generate new tokens
          return genTokens(localClient, userSession);
        }).then((tokenData) => {
          return sendTokenResponse(tokenData, done);
        });
      }).catch(err => done(err));
    },
  };
})();

module.exports = TokenUtils;
