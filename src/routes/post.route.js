const express = require("express");
const router = express.Router();
const postController = require("@/controllers/post.controller");
const uploadPost = require("@/middleware/uploadPost");

// Get all posts
router.get("/", postController.getAllPosts);

// Get related posts
router.get("/related", postController.getRelatedPosts);

// Get post by slug (đặt trước /:id để tránh nuốt)
router.get("/by-slug/:slug", postController.getPostBySlug);

// Get post by ID
router.get("/:id", postController.getPostById);

// Create post
router.post(
  "/",
  uploadPost.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "media", maxCount: 10 }
  ]),
  postController.createPost
);

// Update post
router.put(
  "/:id",
  uploadPost.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "media", maxCount: 10 }
  ]),
  postController.updatePost
);

// Delete post
router.delete("/:id", postController.deletePost);

// Delete specific media in a post
router.delete("/:id/media/:mediaIndex", postController.deletePostMedia);

module.exports = router;
