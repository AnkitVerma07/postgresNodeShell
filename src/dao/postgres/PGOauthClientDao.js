/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const OauthClientModel = require('../../../server/models').oauth_client;

const PGOauthClientDao = (() => {
  return {
    getOauthClientById: (id) => {
      return OauthClientModel.findById(id);
    },

    getOauthClientByClientName: (clientName) => {
      const criteria = {
        where: {
          client_id: clientName,
        },
      };

      return OauthClientModel.findOne(criteria);
    },

    insertClientData: (data) => {
      return OauthClientModel.create(data);
    },
  };
})();

module.exports = PGOauthClientDao;
