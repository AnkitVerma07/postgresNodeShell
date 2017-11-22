/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const models = require('../../../server/models');

const UserSessionModel = models.user_session;

const PGUserSessionDao = (() => {
  return {
    findOrInsertUserSession: (userId, sessionId) => {
      const data = {
        user_id: userId,
        session_id: sessionId,
      };
      const criteria = {
        where: data,
      };

      return UserSessionModel
        .findOrCreate(criteria)
        .spread((userSession, created) => {
          return userSession;
        });
    },

    findUserByUserSessionId: (userSessionId) => {
      const criteria = {
        where: {
          id: userSessionId,
        },
        include: [
          {
            model: models.app_user,
            as: 'user',
            include: [
              {
                model: models.file_upload,
                as: 'avatar_file',
              },
            ],
          },
        ],
      };

      return UserSessionModel.findOne(criteria);
    },
  };
})();

module.exports = PGUserSessionDao;
