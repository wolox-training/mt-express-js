'use strict';

const logger = require('../logger');
const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false
      },

      password: {
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

  Users.associate = function(models) {
    // associations can be defined here
  };

  Users.findUserByEmail = email =>
    Users.findOne({ where: { email } }).catch(err => {
      logger.error(err.detail);
      throw errors.databaseError(err.detail);
    });

  Users.findUser = (email, password) =>
    Users.findOne({ where: { email } && { password } }).catch(err => {
      logger.error(err.detail);
      throw errors.databaseError(err.detail);
    });

  Users.addUser = user =>
    Users.create(user).catch(err => {
      logger.error(err.detail);
      throw errors.databaseError(err.detail);
    });

  return Users;
};
