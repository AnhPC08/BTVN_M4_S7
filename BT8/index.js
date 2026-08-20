import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();

app.use(express.json());

const mockUser = {
  _id: "user_69bbaed745",
  username: "tung",
  password: "tung123",
  role: "USER",
};

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== mockUser.username || password !== mockUser.password) {
    return res.status(401).json({
      status: 401,
      message: "Sai tên đăng nhập hoặc mật khẩu",
    });
  }

  const payload = {
    userId: mockUser._id,
    role: mockUser.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({
    status: 200,
    message: "LOGIN_SUCCESSFUL",
    data: {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    },
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server BT8 đang chạy tại http://localhost:${PORT}`);
});
