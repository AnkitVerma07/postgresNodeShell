/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const PGOauthClientDao = require('./postgres/PGOauthClientDao');

const OauthClientDao = (() => {
  return {
    getOauthClientById: PGOauthClientDao.getOauthClientById,
    getOauthClientByClientName: PGOauthClientDao.getOauthClientByClientName,
    insertClientData: PGOauthClientDao.insertClientData,
  };
})();

module.exports = OauthClientDao;
