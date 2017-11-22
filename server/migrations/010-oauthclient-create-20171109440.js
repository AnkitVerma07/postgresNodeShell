/**
 * Created by Ankit Verma on 11/9/17.
 */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('oauth_client', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      client_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      client_secret: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      scope: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      authorities: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      token_validity_seconds: {
        allowNull: false,
        defaultValue: 300,
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface /* , Sequelize*/) => {
    return queryInterface.dropTable('oauth_client');
  },
};
