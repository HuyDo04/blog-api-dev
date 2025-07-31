const authService = require("@/service/auth.service");

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
