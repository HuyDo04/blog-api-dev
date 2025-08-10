const postService = require("@/service/post.service")

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPostsWithAuthorAndTopic();
   
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách bài viết", error });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await postService.getPostByIdWithAuthorAndTopic(req.params.id);
    if (!post) return res.status(404).json({ message: "Post không tồn tại" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy chi tiết bài viết", error });
  }
};

exports.createPost = async (req, res) => {
  try {
    const postData = req.body;
    if (req.files && req.files.length > 0) {
      postData.media = req.files.map(file => file.path);
    }
    const post = await postService.createPost(postData);
    res.status(201).json({
      message: "Tạo bài viết thành công",
      post
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo bài viết", error });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postData = req.body;
    if (req.files && req.files.length > 0) {
      postData.media = req.files.map(file => file.path);
    }
    const post = await postService.updatePost(req.params.id, postData);
    if (!post) return res.status(404).json({ message: "Bài viết không tồn tại" });
    
    res.json({
      message: "Cập nhật bài viết thành công",
      post
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật bài viết", error });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const result = await postService.deletePost(req.params.id);
    if (!result) return res.status(404).json({ message: "Bài viết không tồn tại" });
    
    res.json({ message: "Xóa bài viết thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa bài viết", error });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await postService.getPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ message: "Bài viết không tồn tại" });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết bài viết", error });
  }
};

exports.deletePostMedia = async (req, res) => {
  try {
    const { id, mediaIndex } = req.params;
    const result = await postService.deletePostMedia(id, mediaIndex);
    if (!result) {
      return res.status(404).json({ message: "Bài viết hoặc media không tồn tại" });
    }
    res.json({ message: "Xóa media thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa media", error });
  }
};