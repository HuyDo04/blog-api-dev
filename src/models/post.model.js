const { slugify } = require("@/utils/slugify");

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      excerpt: DataTypes.TEXT,
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      featuredImage: DataTypes.STRING,
      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      publishedAt: DataTypes.DATE,
      readTime: DataTypes.INTEGER,
      topicId: DataTypes.INTEGER,
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      media: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      tableName: "posts",
      timestamps: true,
      hooks: {
        beforeValidate: async (post) => {
          if (!post.slug && post.title) {
            let baseSlug = slugify(post.title);
            let uniqueSlug = baseSlug;
            let counter = 1;

            // Kiểm tra trùng slug trong DB
            const PostModel = sequelize.models.Post;
            while (await PostModel.findOne({ where: { slug: uniqueSlug } })) {
              uniqueSlug = `${baseSlug}-${counter}`;
              counter++;
            }

            post.slug = uniqueSlug;
          }
        },
        beforeCreate: (post) => {
          // Tính readTime
          if (post.content) {
            const words = post.content.trim().split(/\s+/).length;
            post.readTime = Math.max(1, Math.ceil(words / 200));
          }
          // Nếu publish lần đầu
          if (!post.publishedAt && post.dataValues.published) {
            post.publishedAt = new Date();
          }
        },
        beforeUpdate: (post) => {
          // Re-calc readTime nếu content thay đổi
          if (post.changed("content")) {
            const words = post.content.trim().split(/\s+/).length;
            post.readTime = Math.max(1, Math.ceil(words / 200));
          }
          // Nếu chuyển từ draft sang publish
          if (post.changed("published") && post.published && !post.publishedAt) {
            post.publishedAt = new Date();
          }
        },
      },
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: "authorId", as: "author" });
    Post.belongsTo(models.Topic, { foreignKey: "topicId", as: "topic" });
    Post.belongsToMany(models.Tag, {
      through: "PostTags",
      foreignKey: "postId",
      otherKey: "tagId",
      as: "tags",
    });
  };

  return Post;
};
