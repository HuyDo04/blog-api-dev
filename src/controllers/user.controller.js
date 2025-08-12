const userService = require("@/service/user.service");
const authService = require("@/service/auth.service");

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
      const users = await userService.getAllUser();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy danh sách người dùng", error });
    }
};

// Get user by ID 
exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy chi tiết người dùng", error });
    }
};

// Create new user
exports.createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({
            message: "Tạo người dùng thành công",
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi tạo người dùng", error });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        res.json({
            message: "Cập nhật người dùng thành công",
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật người dùng", error });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        res.json({ message: "Xóa người dùng thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa người dùng", error });
    }
};

exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    if (req.sameAvatar) {
      return res.json({
        message: "Avatar đã giống với ảnh hiện tại, không cần cập nhật.",
        avatar: req.user.avatar, // Return current avatar path
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn ảnh để upload" });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    const user = await userService.updateAvatar(userId, avatarPath);

    res.json({
      message: "Cập nhật avatar thành công",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Lỗi cập nhật avatar:", error);
    if (error.message === "User not found") {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await userService.getUserPosts(userId);
    res.json(posts);
  } catch (error) {
    console.error("Lỗi lấy bài viết của người dùng:", error);
    if (error.message === "User not found") {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }
        const exists = await userService.checkUsernameExists(username);
        res.json({ exists });
    } catch (error) {
        console.error("Error checking username existence:", error);
        res.status(500).json({ message: "Error checking username existence", error });
    }
};