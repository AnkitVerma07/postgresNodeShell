/**
 * Created by Ankit Verma on 11/9/17.
 */
'use strict';


const Sequelize = require('sequelize');

const Enums = (() => {
    return {
      user_types: {
        type: Sequelize.ENUM,
        values: ['APP_USER' , 'ADMIN'],
      },
      user_gender: {
        type: Sequelize.ENUM,
        values: ['MALE', 'FEMALE', 'OTHER'],
      },
    };
})();

module.exports = Enums;
