const multer = require("multer");
const path = require("path");

// Cấu hình nơi lưu file và đặt tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/posts");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Chấp nhận file ảnh và video
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ hỗ trợ file ảnh và video!"), false);
  }
};

const uploadPost = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // max 50MB
});

module.exports = uploadPost;
