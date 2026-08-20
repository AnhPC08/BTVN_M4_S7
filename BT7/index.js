import express from "express";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = 3000;

// 1. CẤU HÌNH MIDDLEWARE RATE LIMIT

// Thiết lập giới hạn: Tối đa 5 request trong vòng 15 phút
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 429,
    message: "Too many login attempts, try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. XÂY DỰNG API ĐĂNG NHẬP

// Gắn middleware authLimiter VÀO TRƯỚC hàm xử lý của route đăng nhập
app.post("/api/login", authLimiter, (req, res) => {
  // Đoạn code này chỉ chạy nếu số lượng request <= 5
  res.status(200).json({
    success: true,
    message: "Đăng nhập thành công! (Giả lập)",
  });
});

// Một API khác không bị giới hạn để so sánh
app.get("/", (req, res) => {
  res.send("Server đang chạy. Hãy gọi POST /api/login để test Rate Limit.");
});

// 3. KHỞI CHẠY SERVER

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(
    `Mở Postman và gửi POST request liên tục tới http://localhost:${PORT}/api/login để kiểm tra.`,
  );
});
