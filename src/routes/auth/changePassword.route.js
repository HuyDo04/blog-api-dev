const express = require("express");

const router = express.Router();

const authController = require("@/controllers/auth.controller")

router.post("/", authController.changePassword)

module.exports = router