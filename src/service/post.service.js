const { Post, User, Topic, Sequelize } = require("@/models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

exports.getAllPostsWithAuthorAndTopic = async () => {
  return await Post.findAll({
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "username", "avatar"]
      },
      {
        model: Topic,
        as: "topic",
        attributes: ["id", "name", "slug", "icon"]
      }
    ],
    order: [["publishedAt", "DESC"]]
  });
};

exports.getPostByIdWithAuthorAndTopic = async (id) => {
  return await Post.findByPk(id, {
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "username", "avatar"]
      },
      {
        model: Topic,
        as: "topic",
        attributes: ["id", "name", "slug", "icon"]
      }
    ]
  });
};

exports.createPost = async (postData) => {
  return await Post.create(postData);
};

exports.updatePost = async (id, postData) => {
  const post = await Post.findByPk(id);
  if (!post) return null;

  await post.update(postData);
  return post;
};

exports.deletePost = async (id) => {
  const post = await Post.findByPk(id);
  if (!post) return false;
  
  await post.destroy();
  return true;
};

exports.getPostBySlug = async (slug) => {
  return await Post.findOne({
    where: { slug },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id","username", "avatar"]
      },
      {
        model: Topic,
        as: "topic",
        attributes: ["id", "name", "slug", "icon"]
      }
    ]
  });
};

exports.deletePostMedia = async (postId, mediaIndex) => {
  const post = await Post.findByPk(postId);
  if (!post) return false;

  let media = post.media || [];
  if (mediaIndex < 0 || mediaIndex >= media.length) return false;

  const mediaPath = media[mediaIndex];
  const fullPath = path.join(__dirname, '..', '..', 'public', mediaPath);

  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    media.splice(mediaIndex, 1);
    await post.update({ media });
    return true;
  } catch (error) {
    console.error("Error deleting media file:", error);
    return false;
  }
};

exports.getPostsByTopicAndExcludePost = async (topicId, excludePostId, limit = 3) => {
  return await Post.findAll({
    where: {
      topicId,
      id: {
        [Op.ne]: excludePostId
      }
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "username", "avatar"]
      },
      {
        model: Topic,
        as: "topic",
        attributes: ["id", "name", "slug", "icon"]
      }
    ],
    limit: parseInt(limit, 10),
    order: [["publishedAt", "DESC"]]
  });
};