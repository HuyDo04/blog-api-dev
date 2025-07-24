const express = require("express");

const registerRouter = require("./auth/register.route");
const verifyEmailRouter = require("./auth/verifyEmail.route");
const loginRouter = require("./auth/login.route");
const resendVerification = require("./auth/resendVerification.route")
const forgotPasswordRouter = require("./auth/forgotPassword.route")

const router = express.Router();

router.use("/register", registerRouter)
router.use("/verify-email", verifyEmailRouter)
router.use("/login", loginRouter)
router.use("/resend-verification", resendVerification)
router.use("/forgot-password", forgotPasswordRouter)

module.exports = router