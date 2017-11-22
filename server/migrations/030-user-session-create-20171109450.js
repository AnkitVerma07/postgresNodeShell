/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_session', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      session_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'app_user',
          key: 'id',
          as: 'user',
        },
      },
    });
  },
  down: (queryInterface /* , Sequelize*/) => {
    return queryInterface.dropTable('user_session');
  },
};
