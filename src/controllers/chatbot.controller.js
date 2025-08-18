
const chatbotService = require('@/service/chatbot.service');

const createConversation = async (req, res, next) => {
    try {
        const conversation = await chatbotService.createConversation();
        res.status(201).json({
            message: 'Conversation created successfully',
            data: conversation,
        });
    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page } = req.query;
        const messages = await chatbotService.getMessages(id, page);
        res.status(200).json({
            message: 'Messages fetched successfully',
            data: messages,
        });
    } catch (error) {
        next(error);
    }
};

const closeConversation = async (req, res, next) => {
    try {
        const { id } = req.params;
        await chatbotService.closeConversation(id);
        res.status(200).json({
            message: 'Conversation closed successfully',
        });
    } catch (error) {
        next(error);
    }
};

const chat = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        const assistantMessage = await chatbotService.handleChat(id, message);
        res.status(201).json({
            message: 'Message sent successfully',
            data: assistantMessage,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createConversation,
    getMessages,
    closeConversation,
    chat,
};
