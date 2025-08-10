const commentService = require("../service/comment.service");

const commentController = {
  // Tạo comment mới
  async createComment(req, res, next) {
    try {
      const { postId, parentId, content } = req.body;
      const authorId = req.user.id; // Lấy từ middleware xác thực

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const newComment = await commentService.create({
        postId,
        authorId,
        parentId,
        content,
      });

      res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  },

  // Lấy tất cả comment của một bài viết
  async getCommentsByPost(req, res, next) {
    try {
      const { postId } = req.params;
      const comments = await commentService.getByPost(postId);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  },

  // Cập nhật comment
  async updateComment(req, res, next) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const updatedComment = await commentService.update(id, userId, content);
      res.status(200).json(updatedComment);
    } catch (error) {
      if (error.message === 'Comment not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  },

  // Xóa comment
  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await commentService.delete(id, userId);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Comment not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  },
};

module.exports = commentController;
