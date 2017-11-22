/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('refresh_token', {
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
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'app_user',
        key: 'id',
      },
    },
  }, {
    underscored: true,
    freezeTableName: true,
  });

  RefreshToken.associate = (models) => {
    // associations can be defined here
    RefreshToken.belongsTo(models.oauth_client, {
      foreignKey: 'client_id',
      as: 'oauth_client',
    });
    RefreshToken.belongsTo(models.access_token, {
      foreignKey: 'access_token_id',
      as: 'access_token',
    });
    RefreshToken.belongsTo(models.app_user, {
      foreignKey: 'user_id',
      as: 'user',
    });
    RefreshToken.belongsTo(models.user_session, {
      foreignKey: 'user_session_id',
      as: 'user_session',
    });
  };

  return RefreshToken;
};
