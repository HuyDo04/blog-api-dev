const express = require("express");

const router = express.Router();

const userController = require("@/controllers/user.controller");
const upload = require("@/middleware/upload");

router.post("/",upload.single("avatar"), userController.updateAvatar)

module.exports = router