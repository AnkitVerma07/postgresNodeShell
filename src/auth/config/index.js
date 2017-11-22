/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const TokenConfig = (() => {
  return {
    token: {
      calculateExpirationDate: (expiresIn) => {
        return new Date(new Date().getTime() + (expiresIn * 1000));
      },
      authorizationCodeLength: 16,
      accessTokenLength: 128,
      refreshTokenLength: 128,
    },
  };
})();

module.exports = TokenConfig;
