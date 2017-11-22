/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserSession = sequelize.define('user_session', {
    id: {
      type: DataTypes.UUIDV1,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUIDV1,
      allowNull: false,
      references: {
        model: 'app_user',
        as: 'user',
      },
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    underscored: true,
    freezeTableName: true,
  });

  UserSession.associate = (models) => {
    UserSession.belongsTo(models.app_user, {
      foreignKey: 'user_id',
      as: 'user',
    });

    UserSession.hasOne(models.access_token, {
      targetKey: 'id',
      as: 'access_token',
    });
  };

  return UserSession;
};
