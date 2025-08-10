module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert("topics", [
          {
              id: 1,
              name: "JavaScript",
              slug: "javascript",
              description: "Everything about JavaScript programming language, frameworks, and best practices.",
              icon: "🚀",
              postCount: 45,
              createdAt: "2023-01-15",
          },
          {
              id: 2,
              name: "React",
              slug: "react",
              description: "React.js tutorials, tips, and advanced patterns for building modern web applications.",
              icon: "⚛️",
              postCount: 32,
              createdAt: "2023-02-10",
          },
          {
              id: 3,
              name: "Node.js",
              slug: "nodejs",
              description: "Server-side JavaScript development with Node.js and its ecosystem.",
              icon: "🟢",
              postCount: 28,
              createdAt: "2023-01-20",
          },
          {
              id: 4,
              name: "CSS",
              slug: "css",
              description: "Modern CSS techniques, animations, and responsive design patterns.",
              icon: "🎨",
              postCount: 23,
              createdAt: "2023-03-05",
          },
      ]);
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete("topics", null, {});
  },
};