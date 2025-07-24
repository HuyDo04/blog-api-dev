const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
        user: "dovhf8193@fullstack.edu.vn",
        pass: "vvgx ihqb wzsw lute",
    }
})

module.exports = transporter