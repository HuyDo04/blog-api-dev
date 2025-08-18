
const { Conversation, Message, Agent } = require("@/models")
const intentClassifier = require('@/utils/chatbot/intentClassifier');
const openai = require('@/utils/chatbot/openai');

const createConversation = async () => {
    const conversation = await Conversation.create();
    return conversation;
};

const getMessages = async (conversationId, page = 1) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const messages = await Message.findAndCountAll({
        where: { conversationId },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
    });

    return messages;
};

const closeConversation = async (conversationId) => {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
        throw new Error('Conversation not found');
    }
    conversation.isClosed = true;
    conversation.closedAt = new Date();
    await conversation.save();
    return conversation;
};

const handleChat = async (conversationId, userMessage) => {
    // 1. Save user message
    await Message.create({
        conversationId,
        role: 'user',
        content: userMessage,
    });

    // 2. Get last 5 user messages for intent classification
    const recentUserMessages = await Message.findAll({
        where: {
            conversationId,
            role: 'user',
        },
        order: [['createdAt', 'DESC']],
        limit: 5,
    });
    const formattedUserMessages = recentUserMessages.reverse().map(m => ({ role: m.role, content: m.content }));

    // 3. Classify intent to get agent pattern
    const agentPattern = await intentClassifier(formattedUserMessages);

    // 4. Load agent from DB
    const agent = await Agent.findOne({ where: { pattern: agentPattern, isActive: true } });
    if (!agent) {
        throw new Error(`Agent with pattern "${agentPattern}" not found or is not active.`);
    }

    // 5. Get last 10 messages (user & assistant) for context
    const recentMessages = await Message.findAll({
        where: {
            conversationId,
        },
        order: [['createdAt', 'DESC']],
        limit: 10,
    });
    const formattedRecentMessages = recentMessages.reverse().map(m => ({ role: m.role, content: m.content }));

    // 6. Send to LLM for response
    const aiMessageContent = await openai.send({
        input: [
            {
                role: "system",
                content: agent.systemPrompt,
            },
            ...formattedRecentMessages
        ]
    });

    // 7. Save assistant response
    const assistantMessage = await Message.create({
        conversationId,
        role: 'assistant',
        content: aiMessageContent,
    });

    return assistantMessage;
};

module.exports = {
    createConversation,
    getMessages,
    closeConversation,
    handleChat,
};
