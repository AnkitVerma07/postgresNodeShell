/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const models = require('../../../server/models');
const AccessTokenModel = models.access_token;
const RefreshTokenModel = models.refresh_token;

const PGRefreshTokenDao = (() => {
  return {
    getRefreshWithAccessJoinedUserSession: (refreshTokenString) => {
      const criteria = {
        where: {
          token: refreshTokenString,
        },
        include: [
          {
            model: models.user_session,
            as: 'user_session',
            include: [
              {
                model: models.app_user,
                as: 'user',
              },
            ],
          },
        ],
      };

      return RefreshTokenModel.findOne(criteria);
    },
  };
})();

module.exports = PGRefreshTokenDao;
