const { User, Post } = require("../models");

exports.getAllUser = async () => {
  return await User.findAll();
};

exports.getUserById = async (id) => {
  return await User.findByPk(id);
};

exports.createUser = async (userData) => {
  return await User.create(userData);
};

exports.updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(userData);
  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return false;
  
  await user.destroy();
  return true;
};

exports.updateAvatar = async (userId, avatarPath) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.avatar = avatarPath;
  await user.save();
  return user;
};

exports.getUserPosts = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [{
      model: Post,
      as: 'posts'
    }]
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user.posts;
};
