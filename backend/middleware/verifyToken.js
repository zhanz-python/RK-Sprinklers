import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // adjust path if needed

export const verifyToken = async (req, res, next) => {
  console.log("Incoming cookies:", req.cookies);

  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });
    }

    req.userId = decoded.userId;

    // 🔑 fetch user to attach isAdmin (and anything else you need)
    const user = await User.findById(decoded.userId).select("isAdmin name email");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; // ✅ now req.user.isAdmin works
    next();
  } catch (error) {
    console.log("Error in verifyToken:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
