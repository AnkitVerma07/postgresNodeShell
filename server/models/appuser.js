/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const crypto = require('crypto');
const USER_ROLE_ENUMS = require('../definitions/enums').user_types;
const USER_GENDER_ENUMS = require('../definitions/enums').user_gender;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('app_user', {
    id: {
      type: DataTypes.UUIDV1,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    pin_code: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    gender: USER_GENDER_ENUMS,
    hashed_password: DataTypes.STRING,
    salt: DataTypes.STRING,
    role: USER_ROLE_ENUMS,
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.VIRTUAL,
      set: function encryptPassword(val) {
        this.setDataValue('password', val);

        const salt = crypto.randomBytes(32).toString('hex');
        // this.hashedPassword = this.encryptPassword(password);
        const hashedPass = crypto.createHmac('sha1', salt).update(val).digest('hex');

        this.setDataValue('hashed_password', hashedPass);
        this.setDataValue('salt', salt);
      },
      validate: {
        isLongEnough: (val) => {
          if (val.length < 8) {
            throw new Error('Password must be at least 8 characters');
          }
        },
      },
    },
  }, {
    underscored: true,
    freezeTableName: true,
    defaultScope: {
      attributes: {
        exclude: ['hashed_password', 'salt'],
      },
    },
    scopes: {
      full: {
        attributes: {},
      },
    },
  });

  User.associate = (models) => {
    // associations can be defined here
  };

  User.prototype.checkPassword = function checkPassword(passwordToCheck) {
    if (!this.salt || !this.hashed_password) {
      return false;
    }

    const passToCheckHash = crypto.createHmac('sha1', this.salt).update(passwordToCheck).digest('hex');
    return this.hashed_password === passToCheckHash;
  };

  return User;
};
