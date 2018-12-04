'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const addCreatedAtColumn = queryInterface.addColumn('albums', 'created_at', {
      type: Sequelize.DATE
    });
    const addUpdatedAtColumn = queryInterface.addColumn('albums', 'updated_at', {
      type: Sequelize.DATE
    });
    const addDeletedAtColumn = queryInterface.addColumn('albums', 'deleted_at', {
      type: Sequelize.DATE
    });

    return Promise.all([addCreatedAtColumn, addUpdatedAtColumn, addDeletedAtColumn]);
  },

  down: (queryInterface, Sequelize) => {
    const removeCreatedAtColumn = queryInterface.removeColumn('albums', 'created_at');
    const removeUpdatedAtColumn = queryInterface.removeColumn('albums', 'updated_at');
    const removeDeletedAtColumn = queryInterface.removeColumn('albums', 'deleted_at');

    return Promise.all([removeCreatedAtColumn, removeUpdatedAtColumn, removeDeletedAtColumn]);
  }
};
