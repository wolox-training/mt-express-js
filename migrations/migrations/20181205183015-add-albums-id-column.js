'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('albums', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('albums', 'id')
};
