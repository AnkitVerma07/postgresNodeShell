/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const fs = require('fs');

const userData = fs.readFileSync(__dirname + '/data/users.json', 'utf8');

module.exports = {
  up: (queryInterface /* , Sequelize*/) => {
    const userJson = JSON.parse(userData);
    return queryInterface.bulkInsert('app_user', userJson);
  },

  down: (queryInterface /* , Sequelize*/) => {
    return queryInterface.bulkDelete('app_user');
  },
};
