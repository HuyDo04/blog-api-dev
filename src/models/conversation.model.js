'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    isClosed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'conversations',
  });

  Conversation.associate = function(models) {
    Conversation.hasMany(models.Message, { foreignKey: 'conversationId', as: 'messages' });
  };

  return Conversation;
};