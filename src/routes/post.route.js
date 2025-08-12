const express = require("express");
const router = express.Router();
const postController = require("@/controllers/post.controller");
const uploadPost = require("@/middleware/uploadPost");
// Get all posts
router.get("/", postController.getAllPosts);
// Get post by ID
router.get("/:id", postController.getPostById);
// Get post by slug
router.get("/by-slug/:slug", postController.getPostBySlug);
// Create, update and delete posts
router.post(
    "/",
    uploadPost.fields([
      { name: "featuredImage", maxCount: 1 },
      { name: "media", maxCount: 10 }
    ]),
    postController.createPost
  );
router.put("/:id", uploadPost.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "media", maxCount: 10 }
  ]), 
  postController.updatePost
);
router.delete("/:id", postController.deletePost);
router.delete("/:id/media/:mediaIndex", postController.deletePostMedia);
module.exports = router;