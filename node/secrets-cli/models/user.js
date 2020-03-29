'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    randomkey: DataTypes.STRING,
    fullName: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true,
    tableName: 'users'
  })
  User.associate = function (models) {
    User.hasMany(models.Secret, {
      sourceKey: 'username',
      foreignKey: 'username',
      as: 'secrets'
    })
  }
  return User
}
