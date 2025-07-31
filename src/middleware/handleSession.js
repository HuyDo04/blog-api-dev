const { randomUUID } = require("node:crypto");
const sessionService = require("@/service/session.service")
// 1. Tạo ra session ID (sid) -> bằng một chuỗi ngẫu nhiên, không trùng lặp
// 2. Gửi phản hồi (server -> client) yêu cầu browser tạo ra cookie sid=xxxx
// 3. Lấy sid từ cookie để xác định client

async function session(req, res, next) {
    let _sid = req.cookies.sid;
    console.log("sid:",req.cookies);
    
    let session = _sid && (await sessionService.findBySid(req.cookies.sid));

    if (!session) {
        _sid = randomUUID();
        const date = new Date();
        session = await sessionService.create({ sid: _sid });
        date.setDate(date.getDate() + 1);
        res.set("Set-Cookie", `sid=${_sid}; path=/; httpOnly; expires=${date}`);
    }

    req.session = session.data ? JSON.parse(session.data) : {};

    res.on("finish", () => {
        sessionService.update(_sid, {
            data: JSON.stringify(req.session),
        });
    });

    console.log("Cookie sid:", req.cookies.sid);
    console.log("Session loaded:", session);
    next();
}

module.exports = session;