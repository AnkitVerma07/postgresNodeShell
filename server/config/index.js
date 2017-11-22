/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';
const Sequelize = require("sequelize");
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    operatorsAliases: Sequelize.Op,
    dialect: 'postgres',
    pool: {
      min: 0,
      max: 5,
    },
  },
};
