'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const posts = await queryInterface.sequelize.query(
      'SELECT id FROM posts;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const post of posts) {
      const content = generateContent(); // chỉ gọi 1 lần
      console.log(`Updating Post ID ${post.id} - Preview: ${content.substring(0, 60)}`);
      await queryInterface.bulkUpdate(
        'posts',
        { content },
        { id: post.id }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Reset lại content về null nếu rollback
    await queryInterface.bulkUpdate('posts', { content: null }, {});
  },
};

// Tạo nội dung HTML giả lập
function generateContent() {
  const paragraphs = faker.number.int({ min: 4, max: 8 });
  let content = '';
  for (let i = 0; i < paragraphs; i++) {
    content += `<p>${faker.lorem.paragraph()}</p>\n`;
  }
  return content;
}
