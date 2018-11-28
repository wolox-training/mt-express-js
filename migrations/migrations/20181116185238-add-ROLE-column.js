'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // logic for transforming into the new state
    queryInterface.addColumn('users', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'regular'
    });
  },

  down: (queryInterface, Sequelize) => {
    // logic for transforming into the new state
    queryInterface.removeColumn('users', 'role');
  }
};
