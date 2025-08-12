const express = require("express");
const router = express.Router();
const userController = require("@/controllers/user.controller");
const uploadAvatar = require("@/middleware/uploadAvatar");
const checkAuth = require("@/middleware/checkAuth");
const checkSameAvatar = require("@/middleware/checkSameAvatar");

// GET /users
router.get("/", userController.getAllUsers);
// Get user by ID
router.get("/:id", userController.getUserById);
// Get all posts by user ID
router.get("/:id/posts", userController.getUserPosts);

router.post("/", userController.createUser);
// Update user
router.put("/:id", userController.updateUser);
// Delete user 
router.delete("/:id", userController.deleteUser);

// router.post("/update-avatar/:id",upload.single("avatar"), userController.updateAvatar)
router.patch("/me/avatar", checkAuth, uploadAvatar.single("avatar"), checkSameAvatar, userController.updateAvatar);

// GET /users/check-username
router.get("/check-username", userController.checkUsername);

module.exports = router;
