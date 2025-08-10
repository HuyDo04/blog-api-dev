'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const topics = await queryInterface.sequelize.query(
      `SELECT id FROM topics;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length || !topics.length) {
      throw new Error("Cần có dữ liệu trong bảng users và topics trước khi seed posts.");
    }

    const posts = [];
    for (let i = 1; i <= 20; i++) {
      const title = `JavaScript Tutorial ${i}: Advanced Concepts and Best Practices`;
      const slug = `javascript-tutorial-${i}`;

      posts.push({
        title,
        excerpt: faker.lorem.sentence(12),
        slug,
        featuredImage: `https://via.placeholder.com/400x200?text=JavaScript+${i}`,
        publishedAt: faker.date.between({ from: '2023-01-01', to: new Date() }),
        readTime: faker.number.int({ min: 3, max: 10 }),
        topicId: faker.helpers.arrayElement(topics).id,
        authorId: faker.helpers.arrayElement(users).id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('posts', posts);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {});
  },
};
