/**
 * Created by Ankit Verma on 11/9/17.
 */
'use strict';

/**
 * This is the standard UserModel that will abide by the default scope.
 */
const models = require('../../../server/models');
const constants = require('../../utils/constants');

const UserModel = models.app_user;
const FullUserModel = UserModel.scope('full');

const PGUserDao = (() => {

  return {

    getFullUserByEmail: (emailAddress) => {
      const criteria = {
        where: {
          email: emailAddress,
        },
      };
      return FullUserModel.findOne(criteria);
    },

    getUserById: (id) => {
      const criteria = {
        where: {
          id: id,
        },
        include: [
          {
            model: models.fusionetics,
            as: 'fusionetics',
          },
        ],
      };
      return FullUserModel.findOne(criteria);
    },

    postInitialUser: async (data) => {
      try {
        const user = await UserModel.create(data);

        const fusioneticsUserData = {
          app_user_id: user.id,
        };

        user.fusionetics = await models.fusionetics.create(fusioneticsUserData);

        return user;
      }
      catch (err) {
        throw err;
      }
    },

  };
})();

module.exports = PGUserDao;
