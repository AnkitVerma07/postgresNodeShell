/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const UserSessionDao = require('../dao/UserSessionDao');

const UserSessionService = (() => {
  return {
    fetchOrInsertUserSession: (userId, sessionId) => {
      return UserSessionDao.findOrInsertUserSession(userId, sessionId);
    },

    fetchUserBySessionId: (userSessionId) => {
      return UserSessionDao.findUserByUserSessionId(userSessionId);
    },
  };
})();

module.exports = UserSessionService;
