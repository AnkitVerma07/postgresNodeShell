'use strict';

/**
 * @author Donald Green <donald.green@medlmobile.com>
 */

const router = require('express-promise-router')();

const OauthClientService = require('../services/OauthClientService');

router.post('/', async (req, res) => {
  const data = req.body;
  return res.success(await OauthClientService.createOauthClient(data));
});

module.exports = router;