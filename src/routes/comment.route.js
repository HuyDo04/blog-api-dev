const express = require("express");
const router = express.Router();
const commentController = require("@/controllers/comment.controller");
const checkAuth = require("@/middleware/checkAuth");

// Tạo comment mới (yêu cầu đăng nhập)
router.post("/", checkAuth, commentController.createComment);

// Lấy tất cả comment của một bài viết (công khai)
router.get("/post/:postId", commentController.getCommentsByPost);

// Cập nhật comment (yêu cầu đăng nhập và là chủ sở hữu)
router.put("/:id", checkAuth, commentController.updateComment);

// Xóa comment (yêu cầu đăng nhập và là chủ sở hữu)
router.delete("/:id", checkAuth, commentController.deleteComment);

module.exports = router;
