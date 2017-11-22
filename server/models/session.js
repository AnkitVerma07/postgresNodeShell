/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('session', {
    sid: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
  }, {
    underscored: true,
    freezeTableName: true,
  });
};
