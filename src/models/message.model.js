'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('user', 'assistant', 'system'),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'messages',
  });

  Message.associate = function(models) {
    Message.belongsTo(models.Conversation, { foreignKey: 'conversationId', as: 'conversation' });
  };

  return Message;
};