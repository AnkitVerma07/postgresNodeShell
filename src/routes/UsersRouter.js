/**
 * Created by Ankit Verma on 11/9/17.
 */
'use strict';

/**
 * @module routers/UsersRouter
 * @author Donald Green <donald.green@medlmobile.com>
 * @requires express-promise-router
 * @requires services/UserService
 */

/**
 * express module with promises to mount user related functions on.
 * @type {Object}
 * @const
 * @namespace UsersRouter
 */
const router = require('express-promise-router')();
const passport = require('passport');
const config = require('../../config/config');
const authAccessToken = require('../utils/auth_tool').authAccessToken;

/**
 * Instance of user service
 * @type {Object}
 * @const
 * @see module:services/UserService
 */
const UserService = require('../services/UserService');

/**
 * Route to register a new user in the database
 * @name post/createUser
 * @function
 * @memberof module:routers/UsersRouter~UsersRouter
 * @inner
 * @param {String} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/', async (req, res) => {
  const data = req.body;

  try {
    const user = await UserService.createUser(data);
    return res.success(user);
  }
  catch (err) {
    return res.fail(err.message);
  }
});

module.exports = router;
