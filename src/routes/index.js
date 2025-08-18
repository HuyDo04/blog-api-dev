const express = require("express");

const registerRouter = require("./auth/register.route");
const verifyEmailRouter = require("./auth/verifyEmail.route");
const loginRouter = require("./auth/login.route");
const resendVerification = require("./auth/resendVerification.route");
const forgotPasswordRouter = require("./auth/forgotPassword.route");
const changePassword = require("./auth/changePassword.route");
const logoutRouter = require("./auth/logout.route");
const meRoute = require("./auth/me.route");
const refreshTokenRoute = require("./auth/refreshToken.route")
const userRoute = require("./user.route")
const topicRoute = require("./topic.route");
const postRoute = require("./post.route");
const commentRoute = require("./comment.route");
const chatbotRouter = require("./chatbot.route");

const router = express.Router();

router.use("/register", registerRouter)
router.use("/verify-email", verifyEmailRouter)
router.use("/login", loginRouter)
router.use("/logout", logoutRouter)
router.use("/resend-verification", resendVerification)
router.use("/forgot-password", forgotPasswordRouter)
router.use("/change-password", changePassword)
router.use("/me", meRoute)
router.use("/refresh-token", refreshTokenRoute)
router.use("/users", userRoute)
router.use("/topics", topicRoute)
router.use("/posts", postRoute)
router.use("/comments", commentRoute)
router.use("/conversations", chatbotRouter)

module.exports = router