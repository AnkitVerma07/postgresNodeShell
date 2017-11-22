/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const models = require('../../../server/models');
const AccessTokenModel = models.access_token;
const RefreshTokenModel = models.refresh_token;

const PGAccessTokenDao = (() => {
  return {
    getByUserId: (userId) => {
      const criteria = {
        where: {
          user_id: userId,
        },
        include: [{
          model: RefreshTokenModel,
          as: 'refresh_token',
        }],
      };

      return AccessTokenModel.findOne(criteria);
    },

    getByUserSessionId: (userSessionId) => {
      const criteria = {
        where: {
          user_session_id: userSessionId,
        },
        include: [{
          model: RefreshTokenModel,
          as: 'refresh_token',
        }],
      };

      return AccessTokenModel.findOne(criteria);
    },

    getByToken: (tokenString) => {
      const criteria = {
        where: {
          token: tokenString,
        },
      };
      return AccessTokenModel.findOne(criteria);
    },

    saveTokenSet: (tokenData) => {
      return models.sequelize.transaction((tran) => {
        const criteria = {
          include: [
            {
              model: RefreshTokenModel,
              as: 'refresh_token',
            },
          ],
          transaction: tran,
        };

        return AccessTokenModel.create(tokenData, criteria);
      });
    },

    deleteTokenSet: (accessTokenId) => {
      return models.sequelize.transaction(async (tran) => {
        const refreshCriteria = {
          where: {
            access_token_id: accessTokenId,
          },
          transaction: tran,
        };

        const accessCriteria = {
          where: {
            id: accessTokenId,
          },
          transaction: tran,
        };

        await RefreshTokenModel.destroy(refreshCriteria);
        return await AccessTokenModel.destroy(accessCriteria);
      });
    },
  };
})();

module.exports = PGAccessTokenDao;
