/**
 * Created by Ankit Verma on 11/9/17.
 */
'use strict';

const OauthClientDao = require('../dao/OauthClientDao');

const OauthClientService = (() => {
  return {
    findByClientId: (id) => {
      return OauthClientDao.getOauthClientById(id);
    },

    findByClientName: (clientId) => {
      return OauthClientDao.getOauthClientByClientName(clientId);
    },

    createOauthClient: (clientData) => {
      return OauthClientDao.insertClientData(clientData);
    },
  };
})();

module.exports = OauthClientService;
