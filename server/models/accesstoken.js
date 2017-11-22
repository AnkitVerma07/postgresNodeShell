/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const AccessToken = sequelize.define('access_token', {
    id: {
      type: DataTypes.UUIDV1,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    token: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    date_expired: {
      type: DataTypes.DATE,
    },
  }, {
    underscored: true,
    freezeTableName: true,
  });

  AccessToken.associate = (models) => {
    AccessToken.belongsTo(models.oauth_client, {
      foreignKey: 'client_id',
      as: 'oautch_client',
    });

    AccessToken.belongsTo(models.app_user, {
      foreignKey: 'user_id',
      as: 'user',
    });

    AccessToken.belongsTo(models.user_session, {
      foreignKey: 'user_session_id',
      as: 'user_session',
    });

    AccessToken.hasOne(models.refresh_token, {
      targetKey: 'id',
      as: 'refresh_token',
    });
  };
  return AccessToken;
};

