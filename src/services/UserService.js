/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const UserDao = require('../dao/UserDao');

const UserService = (() => {
  // Public Methods
  return {
    fetchFullUserByEmail: (email) => {
      return UserDao.getFullUserByEmail(email);
    },

    createUser: async (data) => {
      let insertData = {
        pin_code: data.pin_code,
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: data.birth_date,
        gender: data.gender,
        role: data.role,
        email: data.email,
        password: data.password
      };
    },
  };
})();

module.exports = UserService;
