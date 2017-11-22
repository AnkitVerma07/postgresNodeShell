/**
 * Created by Ankit Verma on 11/22/17.
 */

'use strict';

const nconf = require('nconf');
const path = require('path');

const configFileName = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase().trim() + '-config.json' : 'config.json';

const pathToConfig = path.join(__dirname, '/app_configs/', configFileName);
const fileConfig = { file: pathToConfig };

nconf
  .argv()
  .env()
  .file(fileConfig);

module.exports = nconf;
