const constants = require('../../app/constants');

('use strict');

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('users', 'currentSessionKey', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: constants.DEFAULT_CURRENT_SESSION_KEY
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'currentSessionKey');
  }
};
