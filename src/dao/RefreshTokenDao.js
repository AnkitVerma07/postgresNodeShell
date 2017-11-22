/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const PGRefreshTokenDao = require('./postgres/PGRefreshTokenDao');

const RefreshTokenDao = (() => {
  return {
    getRefreshWithAccessJoinedUserSession: PGRefreshTokenDao.getRefreshWithAccessJoinedUserSession,
  };
})();

module.exports = RefreshTokenDao;
