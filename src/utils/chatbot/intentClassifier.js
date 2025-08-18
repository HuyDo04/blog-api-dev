const openai = require("./openai");
const db = require('../../models');

async function intentClassifier(messages) {
    const activeAgents = await db.Agent.findAll({
        where: { isActive: true },
        attributes: ['name', 'pattern'],
    });

    if (activeAgents.length === 0) {
        return 'defaultAgent';
    }

    const agentList = activeAgents.map(agent => `- ${agent.pattern}: ${agent.name}`).join('\n');
    const agentPatterns = activeAgents.map(agent => agent.pattern);

    const systemPrompt = `
        Nhiệm vụ duy nhất của bạn là xác định ý định/mong muốn của khách hàng dựa vào các tin nhắn gần nhất và chọn ra agent phù hợp nhất.

        Cách thức phân loại:
        - Đọc tin nhắn và chọn agent phù hợp dựa trên mô tả sau:
        ${agentList}
        - Chọn "defaultAgent" khi không thể xác định được ý định hoặc khi không phù hợp với các agent trên.

        Cách thức phản hồi:
        - Trả về DUY NHẤT pattern của agent, KHÔNG KÈM THEO BẤT CỨ KÝ TỰ NÀO. Ví dụ: "saleProAgent"
        - Luôn trả về "defaultAgent" nếu không chắc chắn.

        Các tin nhắn gần đây của khách hàng là:
        `;

    const result = await openai.send({
        temperature: 0.2,
        input: [
            {
                role: "system",
                content: systemPrompt,
            },
            ...messages,
        ],
    });

    // Clean up the result to ensure it's just the pattern
    const pattern = result.trim().replace(/[\"\']/g, '');
    console.log(pattern)
    // Validate that the returned pattern is one of the active patterns
    if (agentPatterns.includes(pattern)) {
        return pattern;
    }

    return 'defaultAgent';
}

module.exports = intentClassifier;
