import express from "express";
import { addAvailableDate, requestSlot } from "../controllers/calendar.controller.js";
import { protectRoute, adminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-date", protectRoute, adminRoute, addAvailableDate);

router.post("/request", protectRoute, requestSlot);

export default router;
