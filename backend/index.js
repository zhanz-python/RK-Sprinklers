import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import availabilityRoutes from "./routes/availability.routes.js";
import slotsSubmittedRoutes from "./routes/slotsSubmitted.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/slots", slotsSubmittedRoutes);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("Server is running on port:", PORT);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
});

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER:", process.env.SMTP_USER);

app.get("/", (req, res) => {
  res.send("RK-Sprinklers backend is running 🚀");
});
