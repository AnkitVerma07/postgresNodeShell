/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const envConfig = require(__dirname + '/../config')[env];
const db = {};

const isConfigValid = (cnf) => {
  return (cnf &&
    cnf.username &&
    cnf.password &&
    cnf.host &&
    cnf.dialect &&
    cnf.database
  );
};

let sequelize;
if (config && config.use_env_variable) {
  // Using an environment variable that contains a URI
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else if (isConfigValid(envConfig)) {
  // Using config file built from several environment variables
  sequelize = new Sequelize(envConfig);
} else {
  // Using a config definition that exists in the config.json file
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) &&
      (file !== basename) &&
      (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
