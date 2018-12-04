'use strict';

const logger = require('../logger');
const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const Albums = sequelize.define(
    'albums',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false
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

  Albums.findAlbumsByOwnerId = ownerId =>
    Albums.findAll({ where: { ownerId } }).catch(err => {
      logger.error(err);
      throw errors.databaseError(err);
    });

  Albums.addAlbum = album =>
    Albums.create(album).catch(err => {
      logger.error(err.detail);
      throw errors.databaseError(err.detail);
    });

  return Albums;
};
