'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verify_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verify_token_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reset_password_otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reset_password_otp_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = function(models) {
    // User belongsTo Post
    User.associate = function(models) {
      User.hasMany(models.RefreshToken, {
        foreignKey: 'user_id',  // tên cột khóa ngoại trong bảng refresh_tokens
        as: 'refreshTokens',    // tên alias để include sau này: user.refreshTokens
      });
    };
    
  };

  return User;
};
