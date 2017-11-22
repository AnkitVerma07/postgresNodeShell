/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const clientRoles = require('../../utils/constants').CLIENT_ROLES;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charlen = chars.length;

const OauthUtils = (() => {
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
  };

  const isAdmin = (role) => {
    return clientRoles.admin === role;
  };

  const isUser = (role) => {
    return clientRoles.user === role || isAdmin(role);
  };

  return {
    uid: (len) => {
      const buf = [];
      for (let i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
      }
      return buf.join('');
    },

    checkUserRole: (role) => {
      return isUser(role);
    },

    checkAdminRole: (role) => {
      return isAdmin(role);
    },
  };
})();

module.exports = OauthUtils;
