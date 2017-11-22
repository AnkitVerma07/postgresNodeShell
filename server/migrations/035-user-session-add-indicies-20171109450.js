/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('user_session', ['user_id', 'session_id'], {
      indexName: 'user_session_index',
      indicesType: 'UNIQUE',
    });
  },
  down: (queryInterface /* , Sequelize*/) => {
    return queryInterface.removeIndex('user_session', 'user_session_index');
  },
};
