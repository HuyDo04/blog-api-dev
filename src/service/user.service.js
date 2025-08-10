const { User } = require("../models");

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
