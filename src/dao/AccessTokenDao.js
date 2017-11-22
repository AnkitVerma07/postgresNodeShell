/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const PGAccessTokenDao = require('./postgres/PGAccessTokenDao');

const AccessTokenDao = (() => {
  return {
    getByUserId: PGAccessTokenDao.getByUserId,
    getByUserSessionId: PGAccessTokenDao.getByUserSessionId,
    getByToken: PGAccessTokenDao.getByToken,
    saveTokenSet: PGAccessTokenDao.saveTokenSet,
    deleteTokenSet: PGAccessTokenDao.deleteTokenSet,
  };
})();

module.exports = AccessTokenDao;
