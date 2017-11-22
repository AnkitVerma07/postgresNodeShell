/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('access_token', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      date_expired: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      client_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'oauth_client',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.UUID,
        unique: true,
        references: {
          model: 'app_user',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      user_session_id: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: true,
        references: {
          model: 'user_session',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },
  down: (queryInterface /* , Sequelize*/) => {
    return queryInterface.dropTable('access_token');
  },
};
