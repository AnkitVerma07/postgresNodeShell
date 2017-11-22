/**
 * Created by Ankit Verma on 11/9/17.
 */


'use strict';
const USER_ROLE_ENUMS = require('../definitions/enums').user_types;
const USER_GENDER_ENUMS = require('../definitions/enums').user_gender;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('app_user', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      email: {
        unique: true,
        type: Sequelize.STRING,
      },
      hashed_password: {
        type: Sequelize.STRING,
      },
      salt: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      pin_code:{
        type: Sequelize.STRING,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      birth_date: {
        type: Sequelize.DATE,
      },
      gender:  {
        type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER')
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'APP_USER')
      },
    });
  },
  down: (queryInterface /* , Sequelize*/) => {
    return queryInterface.dropTable('app_user');
  },
};
