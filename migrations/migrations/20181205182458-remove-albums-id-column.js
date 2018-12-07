'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.removeColumn('albums', 'id'),

  down: (queryInterface, Sequelize) =>
    queryInterface.addColumn('albums', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    })
};
