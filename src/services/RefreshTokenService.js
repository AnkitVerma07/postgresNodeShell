/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const RefreshTokenDao = require('../dao/RefreshTokenDao');

const RefreshTokenService = (() => {
  return {
    fetchWithAccessJoinedUserSession: (userId) => {
      return RefreshTokenDao.getRefreshWithAccessJoinedUserSession(userId);
    },
  };
})();

module.exports = RefreshTokenService;
