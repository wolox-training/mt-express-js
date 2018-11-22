'use strict';

const logger = require('../logger');
const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const Albums = sequelize.define(
    'albums',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      },

      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'first_name',
        autoIncrement: true,
        primaryKey: true
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },

    {
      paranoid: true,

      underscored: true,

      freezeTableName: true
    }
  );

  Albums.associate = function(models) {
    // associations can be defined here
  };

  Albums.getAllAlbums = () =>
    Albums.findAndCountAll({
      attributes: ['userId', 'id', 'title']
    }).catch(err => {
      logger.errors(err.details);
      throw errors.databaseError(err.details);
    });

  return Albums;
};
