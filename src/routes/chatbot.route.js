
const express = require('express');
const router = express.Router();
const chatbotController = require('@/controllers/chatbot.controller');


// [POST] /conversations: Create a new conversation
router.post('/', chatbotController.createConversation);

// [POST] /conversations/:id/chat: Send a message to a conversation
router.post('/:id/chat', chatbotController.chat);

// [GET] /conversations/:id/messages: Get messages from a conversation
router.get('/:id/messages', chatbotController.getMessages);

// [PATCH] /conversations/:id/close: Close a conversation
router.patch('/:id/close', chatbotController.closeConversation);

module.exports = router;
