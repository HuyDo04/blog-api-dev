const { Comment, User } = require('@/models');

const MAX_DEPTH = 3;

const commentService = {
  // Tạo comment mới (có xử lý giới hạn 3 cấp reply)
  async create(data) {
    if (data.parentId) {
      const parentComment = await Comment.findByPk(data.parentId);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }

      const depth = await this.getCommentDepth(parentComment);
      if (depth >= MAX_DEPTH) {
        // Nếu comment cha đã ở độ sâu tối đa,
        // thì comment mới sẽ trở thành "anh em" với nó,
        // bằng cách lấy parentId của comment cha làm parentId cho mình.
        data.parentId = parentComment.parentId;
      }
    }
    const comment = await Comment.create(data);
    return this.getById(comment.id); // Trả về kèm author
  },

  // Hàm đệ quy để tính độ sâu của comment
  async getCommentDepth(comment, currentDepth = 1) {
    if (!comment.parentId) return currentDepth;
    const parent = await Comment.findByPk(comment.parentId);
    if (!parent) return currentDepth;
    return this.getCommentDepth(parent, currentDepth + 1);
  },

  // Lấy 1 comment theo id (bao gồm thông tin author)
  async getById(id) {
    return Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
      ]
    });
  },

  // Lấy tất cả comment theo postId (bao gồm replies và nested replies)
  async getByPost(postId) {
    const comments = await Comment.findAll({
      where: { postId, parentId: null },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'avatar']
            },
            {
              model: Comment,
              as: 'replies',
              include: [
                {
                  model: User,
                  as: 'author',
                  attributes: ['id', 'username', 'avatar']
                }
              ]
            }
          ]
        }
      ]
    });

    return comments;
  },

  // Cập nhật nội dung comment
  async update(id, userId, newContent) {
    const comment = await Comment.findByPk(id);
    if (!comment) throw new Error('Comment not found');
    if (comment.authorId !== userId) throw new Error('Unauthorized');

    comment.content = newContent;
    comment.isEdited = true;
    await comment.save();
    return comment;
  },

  // Xóa comment (và replies con cháu)
  async delete(id, userId) {
    const comment = await Comment.findByPk(id);
    if (!comment) throw new Error('Comment not found');
    if (comment.authorId !== userId) throw new Error('Unauthorized');

    await this.deleteRepliesRecursively(id);
    await comment.destroy();
    return { message: 'Deleted successfully' };
  },

  // Xóa tất cả replies (đệ quy)
  async deleteRepliesRecursively(parentId) {
    const replies = await Comment.findAll({ where: { parentId } });
    for (const reply of replies) {
      await this.deleteRepliesRecursively(reply.id);
      await reply.destroy();
    }
  },
};

module.exports = commentService;
