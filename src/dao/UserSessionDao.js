/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const PGUserSessionDao = require('./postgres/PGUserSessionDao');

const UserSessionDao = (() => {
  return {
    findOrInsertUserSession: PGUserSessionDao.findOrInsertUserSession,
    findUserByUserSessionId: PGUserSessionDao.findUserByUserSessionId,
  };
})();

module.exports = UserSessionDao;
