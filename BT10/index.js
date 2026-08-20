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
    return res.status(401).json({ message: "Sai thông tin" });
  }

  const payload = { userId: mockUser._id, role: mockUser.role };

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

app.post("/api/auth/refresh-token", (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: "Không tìm thấy Refresh Token",
      });
    }

    const tokenString = refreshToken.startsWith("Bearer ")
      ? refreshToken.split(" ")[1]
      : refreshToken;

    const decoded = jwt.verify(tokenString, process.env.JWT_REFRESH_SECRET);

    const newPayload = { userId: decoded.userId, role: decoded.role };
    const newAccessToken = jwt.sign(newPayload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({
      status: 200,
      message: "SUCCESS",
      data: {
        accessToken: `Bearer ${newAccessToken}`,
      },
    });
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "INVALID_OR_EXPIRED_REFRESH_TOKEN",
      errors: error.message,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server BT10 đang chạy tại http://localhost:${PORT}`);
});
