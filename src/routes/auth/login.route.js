const express = require("express");

const router = express.Router();

const authController = require("@/controllers/auth.controller")

router.post("/", authController.login)

router.get("/me", authController.me)

module.exports = router