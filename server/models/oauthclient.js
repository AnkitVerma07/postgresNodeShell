/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const OauthClient = sequelize.define('oauth_client', {
    id: {
      type: DataTypes.UUIDV1,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    client_id: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    client_secret: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    scope: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    authorities: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    token_validity_seconds: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 300,
    },
  }, {
    underscored: true,
    freezeTableName: true,
  });
  return OauthClient;
};
