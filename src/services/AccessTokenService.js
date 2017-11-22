/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const AccessTokenDao = require('../dao/AccessTokenDao');

const AccessTokenService = (() => {
  return {
    fetchByUserId: (userId) => {
      return AccessTokenDao.getByUserId(userId);
    },

    fetchByUserSessionId: (userSessionId) => {
      return AccessTokenDao.getByUserSessionId(userSessionId);
    },

    fetchByToken: (userId) => {
      return AccessTokenDao.getByToken(userId);
    },

    saveTokenSet: (accessToken, refreshToken) => {
      const tokenData = accessToken;
      tokenData.refresh_token = refreshToken;
      return AccessTokenDao.saveTokenSet(tokenData);
    },

    deleteTokenSet: (accessTokenId) => {
      return AccessTokenDao.deleteTokenSet(accessTokenId);
    },
  };
})();

module.exports = AccessTokenService;
