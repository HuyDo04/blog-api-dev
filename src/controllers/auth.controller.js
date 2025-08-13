const transporter = require("@/config/mailer");
const authService = require("@/service/auth.service");
const refreshTokenService = require("@/service/refreshToken.service")
const { compare, hash } = require("@/utils/bcrypt");
const { createToken, verifyToken, signToken } = require("@/utils/jwt");
const bcrypt = require("bcrypt")
const md5 = require("md5");
const expiresIn = 3600;

// Register
exports.register = async (req, res) => {
    try {
        const {username ,email, password, confirmPassword} = req.body;
        
        if(!username) return res.status(401).json({message:"Username không được để trống"})

        if( password !== confirmPassword) {
            return res.status(400).json({ message: "Mật khẩu không khớp." });
        }

        const existingEmail = await authService.getByEmail(email);
        
        if(existingEmail) {
            return res.status(400).json({message:"Email đã tồn tại."})
        }

        const hashedPassword = await hash(password, 10);
        
        const newUser = await authService.create({
            username,
            email,
            password: hashedPassword
        })

        const token = createToken(
            {userId: newUser.id},
            // {expiresIn: expiresIn},
            { expiresIn: "2d" }
        )

        await authService.update(newUser.id, {
            verify_token: token,
            // verify_token_expires_at: new Date(Date.now() + 60 * 60 * 1000)
            verify_token_expires_at: new Date(Date.now() + 60 * 1000)

        })

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        // const verifyUrl = `${req.protocol}://${req.host}/api/v1/verify-email?token=${token}`;

        
        await transporter.sendMail({
            from: "dovhf8193@fullstack.edu.vn",
            to: newUser.email,
            subject: "Xác minh tài khoản",
            html: `
            <div>
            <p>Nhấn vào đây để xác thực:</p>
            <p><a href="${verifyUrl}">Xác minh tài khoản</a></p>
            </div>
        `
            })
    
        res.status(201).json({message: "Đăng ký tài khoản thành công. Vui lòng kiểm tra email để xác thực"})
    
    } catch (error) {
        console.log("Lỗi đăng ký:", error)
        res.status(500).json({message: "Lỗi khi đăng ký tài khoản"})
    }
}

// Verify Email
exports.verifyEmail = async (req, res) => {
    try {
        const token = req.query.token;
        
        const verify = verifyToken(token);
        
        if(verify.success) {
            const userId = verify.data.userId;
            
            const user = await authService.getById(userId);
            
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng." });
              }

            if(user.verified_at) {
                return res.status(400).json({ message: "Tài khoản đã xác thực." });
            }

            
            if (new Date(user.verify_token_expires_at) < new Date()) {
                return res.status(400).json({ message: "Vui lòng gửi lại email xác thực." });
            }

            await authService.update(user.id, { 
                verified_at: new Date(),
                verify_token: null,
                verify_token_expires_at: null,
             });
            return res.status(200).json({ message: "Xác thực email thành công." });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." }); 
    }
}

// Resend email
exports.resendVerifyEmail = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await authService.getByEmail(email);
    
        if (!user) return res.status(404).json({message: "Email không tồn tại"})

        if (user.verify_token_expires_at && user.verify_token_expires_at > new Date()) {
            return res.status(400).json({ message: "Vui lòng kiểm tra email để xác thực." });
        }

        const token = createToken(
            {userId: user.id},
            // {expiresIn: 60 * 60 * 12}
            {expiresIn: 60 * 12}

        )
        await authService.update(user.id, {
            verify_token: token,
            verify_token_expires_at: new Date(Date.now() + 60 * 1000),
          });

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        // const verifyUrl = `${req.protocol}://${req.host}/api/v1/verify-email?token=${token}`;
        
        await transporter.sendMail({
            from: "dovhf8193@fullstack.edu.vn",
            to: user.email,
            subject: "Xác minh tài khoản",
            html: `
            <div>
            <p>Nhấn vào đây để xác thực:</p>
            <p><a href="${verifyUrl}">Xác minh tài khoản</a></p>
            </div>
        `
            })
    
        res.status(201).json({message: "Vui lòng kiểm tra email để xác thực."})
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra khi gửi lại email xác thực." })
    }
}

// Login 
exports.login = async (req, res) => {
    const user = await authService.getByEmail(req.body.email);

    if(!user) return res.status(401).json({message:"Tài khoản, mật khẩu không hợp lệ."})
        
    if( !user.verified_at) return res.status(401).json("Vui lòng xác thục email")

    const isValid = await compare(req.body.password, user.password);
    
    if(!isValid) res.status(401).json({message:"Tài khoản, mật khẩu không hợp lệ."});

    const token = signToken({userId: user.id})
    const refreshToken = await refreshTokenService.createRefreshToken(user.id);
    
    // req.session.userId = user.id;
    // Bổ sung token lưu vào local hoặc cookie
    res.status(200).json({
        access_token: token,
        refresh_token : refreshToken.token,
        token_type: "Bearer",
        expires_in: expiresIn
    })
}

// Forgot Password

exports.forgotPassword = async (req, res) => {
    const {email} = req.body;

    const user = await authService.getByEmail(email);
    
    if (!user) return res.status(404).json({message: "Email không hợp lệ"});

    if (!user.verified_at) return res.status(400).json({message: "Email chưa được xác thực. Vui lòng xác thực email"});

    let otp = user.reset_password_otp;
    let expiresAt = user.reset_password_otp_expires_at;

  const now = new Date();

  // Nếu OTP hết hạn -> tạo mới
    if (!otp || new Date(expiresAt) < now) {
        otp = Math.floor(100000 + Math.random() * 900000).toString();
        expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 phút từ giờ

        await authService.update(user.id, {
        reset_password_otp: otp,
        reset_password_otp_expires_at: expiresAt,
        });
    }

    await transporter.sendMail({
        from: "dovhf8193@fullstack.edu.vn",
        to: user.email,
        subject: "Reset Password",
        html: `
            <h2>${otp} là mã xác thực đặt lại mật khẩu của bạn.</h2>
            <p>Mã có hiệu lực trong 10 phút.</p>
        `
    })

    return res.status(200).json({ message: "Đã gửi lại OTP đặt lại mật khẩu. Vui lòng kiểm tra email."})
}

// Verify OTP
exports.verifyOtp = async (req, res) => {
    const {otp, email} = req.body;
    const user = await authService.getByEmail(email);

    if(!user) return res.status(404).json({message: "Tài khoản không tồn tại"});

    if(new Date(user.reset_password_otp_expires_at) < new Date()) return res.status(401).json({message: "Mã OTP đã hết hạn."})

    if(user.reset_password_otp !== otp) return res.status(400).json({message:"Mã OTP không đúng."})

    return res.status(200).json({message: "Xác thực OTP thành công"})
    
}

// Reset Password
exports.resetPassword = async (req, res) => {
    const {email, password, confirmPassword} = req.body;

    if (!email || !password || !confirmPassword) return res.status(400).json({ message: "Không được để trống" });

    if (password !== confirmPassword) return res.status(400).json({message:"Mật khẩu không khớp"});

    const user = await authService.getByEmail(email);

    const hashedPassword = await hash(password, 10);

    await authService.update(user.id, {
        password: hashedPassword,
        reset_password_otp: null,
        reset_password_otp_expires_at: null
    })
    
    return res.status(201).json({message: "Đặt lại  mật khẩu thành công"})
}

// Resend OTP

exports.resendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email là bắt buộc." });
        
    const user = await authService.getByEmail(email);

    if (!user) return res.status(404).json({ message: "Tài khoản không tồn tại." });

    let otp = user.reset_password_otp;
    let expiresAt = user.reset_password_otp_expires_at;
  
    const now = new Date();
  
    // Nếu OTP hết hạn -> tạo mới
    if (!otp || new Date(expiresAt) < now) {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 phút từ giờ
  
      await authService.update(user.id, {
        reset_password_otp: otp,
        reset_password_otp_expires_at: expiresAt,
      });
    }

    await transporter.sendMail({
    from: "dovhf8193@fullstack.edu.vn",
    to: user.email,
    subject: "Mã OTP mới đặt lại mật khẩu",
    html: `
        <h2>${otp} là mã xác thực đặt lại mật khẩu mới của bạn.</h2>
        <p>Mã có hiệu lực trong 10 phút.</p>
    `,
    });

    return res.status(200).json({
    message: "Đã gửi lại OTP đặt lại mật khẩu. Vui lòng kiểm tra email.",
    });
};

exports.changePassword = async (req, res) => {
    
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập." });
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu mới không khớp." });
    }

    const user = await authService.getById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    const isMatch = await compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng." });
    }

    const hashed = await hash(newPassword, 10);

    await authService.update(userId, { password: hashed });

    return res.status(200).json({ message: "Đổi mật khẩu thành công." });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại." });
  }
}

exports.logout = async (req, res) => {
    // await 
    return res.status(201).json({message:"Đăng xuất thành công"})
}

// get current user
exports.getCurrentUser = async (req, res) => {  
  return res.status(200).json(req.user)
}

// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const oldToken = req.body.refresh_token;

    const refreshTokenRecord = await refreshTokenService.getByToken(oldToken);

    if (!refreshTokenRecord) {
      return res.status(403).json("Refresh token invalid");
    }

    const user = await authService.getById(refreshTokenRecord.user_id);
    if (!user) {
      return res.status(401).json("Invalid user");
    }

    // Tạo access token mới
    const accessToken = signToken({ userId: refreshTokenRecord.user_id });

    // Xoá refresh token cũ
    await refreshTokenService.removeByToken(oldToken);

    // Tạo refresh token mới
    const newRefreshToken = await refreshTokenService.createRefreshToken(user.id);

    return res.status(200).json({
      access_token: accessToken,
      refresh_token: newRefreshToken.token,
      token_type: "Bearer",
      expires_in: 60 * 60,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    // Lấy refresh token từ body hoặc header
    const refreshToken = req.body.refresh_token;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required." });
    }

    // Xoá refresh token khỏi DB
    await refreshTokenService.removeByToken(refreshToken);

    return res.status(200).json({ message: "Đăng xuất thành công." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại." });
  }
};