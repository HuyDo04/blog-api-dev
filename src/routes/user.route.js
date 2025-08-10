const express = require("express");
const router = express.Router();
const userController = require("@/controllers/user.controller");
const upload = require("@/middleware/upload");

// GET /users
router.get("/", userController.getAllUsers);
// Get user by ID
router.get("/:id", userController.getUserById);
// Create new user
router.post("/", userController.createUser);
// Update user
router.put("/:id", userController.updateUser);
// Delete user 
router.delete("/:id", userController.deleteUser);

router.post("/update-avatar/:id",upload.single("avatar"), userController.updateAvatar)

module.exports = router;
