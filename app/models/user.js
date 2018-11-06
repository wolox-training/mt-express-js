'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    
    id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         selfIncrement: true,
         primaryKey: true
        },

    firstName: {
                type:DataTypes.STRING,
                allowNull: false
               },

    lastName: {
               type: DataTypes.STRING,
               allowNull: false
              },

    email: {
            type: DataTypes.STRING,
            allowNull: false
          },

    password: {
               type: DataTypes.STRING,
               allowNull: false
              }
  }, {
    
    timestamps: false,

    paranoid: true,
  
    underscored: true,
    
    freezeTableName: true  
  });

  user.associate = function(models) {
    // associations can be defined here
  };

  return user;
};