/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const PGUserDao = require('./postgres/PGUserDao');

/**
 */
const UserDao = (() => {
  // Public Methods
  return {
    getFullUserByEmail: PGUserDao.getFullUserByEmail,
    postInitialUser: PGUserDao.postInitialUser,
    getUserById: PGUserDao.getUserById
  };
})();

module.exports = UserDao;
