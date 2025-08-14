const express = require("express");
const router = express.Router();
const userController = require("@/controllers/user.controller");
const uploadAvatar = require("@/middleware/uploadAvatar");
const checkAuth = require("@/middleware/checkAuth");
const checkSameAvatar = require("@/middleware/checkSameAvatar");

// Get all users
router.get("/", userController.getAllUsers);

// Check username (đặt trước /:id)
router.get("/check-username", userController.checkUsername);

// Get all posts by user ID
router.get("/:id/posts", userController.getUserPosts);

// Get user by ID
router.get("/:id", userController.getUserById);

// Create user
router.post("/", userController.createUser);

// Update user
router.put("/:id", userController.updateUser);

// Delete user
router.delete("/:id", userController.deleteUser);

// Update avatar (current user)
router.patch(
  "/me/avatar",
  checkAuth,
  uploadAvatar.single("avatar"),
  checkSameAvatar,
  userController.updateAvatar
);

module.exports = router;
