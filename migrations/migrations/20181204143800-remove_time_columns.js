'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const removeCreatedAtColumn = queryInterface.removeColumn('albums', 'createdAt');
    const removeUpdatedAtColumn = queryInterface.removeColumn('albums', 'updatedAt');

    return Promise.all([removeCreatedAtColumn, removeUpdatedAtColumn]);
  },

  down: (queryInterface, Sequelize) => {
    const addCreatedAtColumn = queryInterface.addColumn('albums', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE
    });

    const addUpdatedAtColumn = queryInterface.addColumn('albums', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE
    });

    return Promise.all([addCreatedAtColumn, addUpdatedAtColumn]);
  }
};
