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
    const user = await authService.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    // Đảm bảo có file upload
    if (!req.file) return res.status(400).json({ message: "Vui lòng chọn ảnh để upload" });

    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({
      message: "Cập nhật avatar thành công",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Lỗi cập nhật avatar:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};