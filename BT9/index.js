import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();
app.use(express.json());

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "TOKEN_REQUIRED",
        errors: null,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "INVALID_OR_EXPIRED_TOKEN",
      errors: error.message,
    });
  }
};

app.get("/api/users", authMiddleware, (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Truy cập thành công danh sách Users!",
    currentUser: req.user,
    data: [
      { id: 1, name: "Nguyen Van A" },
      { id: 2, name: "Tran Thi B" },
    ],
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server BT9 đang chạy tại http://localhost:${PORT}`);
});
