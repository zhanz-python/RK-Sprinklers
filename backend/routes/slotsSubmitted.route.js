import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { SlotsSubmitted } from "../models/slotsSubmitted.model.js";
import Availability from "../models/availability.model.js";

const router = express.Router();

router.use(verifyToken);

const startAutoDelete = () => {
  setInterval(async () => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setMonth(now.getMonth() - 1);

    try {
      const result = await SlotsSubmitted.deleteMany({
        slotDate: { $lt: cutoff },
      });

      if (result.deletedCount > 0) {
        console.log(
          `Deleted ${result.deletedCount} slots with slotDate older than 1 month.`
        );
      }
    } catch (err) {
      console.error("Error auto-deleting old slots:", err);
    }
  }, 60 * 60 * 1000); // every 1 hour
};

startAutoDelete();

// --- Get all slots ---
router.get("/", async (req, res) => {
  try {
    const slots = await SlotsSubmitted.find()
      .populate("userId", "name number street city zipCode email")
      .lean();

    const formattedSlots = slots.map((s) => ({
      ...s,
      slotDate: s.slotDate.toISOString(),
      userId: s.userId._id.toString(),
      userName: s.userId.name,
      userPhone: s.userId.number || "",
      userAddress: `${s.userId.street || ""}, ${s.userId.city || ""} ${s.userId.zipCode || ""}`.trim(),
    }));

    res.json(formattedSlots);
  } catch (err) {
    console.error("Error in GET /api/slots:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Get slots by user ---
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const slots = await SlotsSubmitted.find({ userId }).lean();

    const formattedSlots = slots.map((s) => ({
      ...s,
      slotDate: s.slotDate.toISOString(),
      userId: s.userId.toString(),
    }));

    res.json(formattedSlots);
  } catch (err) {
    console.error("Error in GET /api/slots/user/:userId:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Create a new slot ---
router.post("/", async (req, res) => {
  try {
    const { userId, slotDate, slotNumber } = req.body;

    if (!userId || !slotDate || slotNumber === undefined || slotNumber === null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Normalize date to midnight
    const slotDateObj = new Date(slotDate);
    slotDateObj.setHours(0, 0, 0, 0);

    // Check availability
    const availability = await Availability.findOne({ date: slotDateObj });
    if (!availability || !availability.isAvailable) {
      return res.status(400).json({
        message: `Cannot book slot on ${slotDateObj.toDateString()}. Day is unavailable.`,
      });
    }

    // Check if slot number is already taken
    const existing = await SlotsSubmitted.findOne({
      slotDate: slotDateObj,
      slotNumber,
    });
    if (existing) {
      return res.status(400).json({
        message: `Slot ${slotNumber} on ${slotDateObj.toDateString()} is already taken.`,
      });
    }

    // Create new slot
    const newSlot = new SlotsSubmitted({ userId, slotDate: slotDateObj, slotNumber });
    await newSlot.save();

    res.status(201).json({
      ...newSlot.toObject(),
      slotDate: newSlot.slotDate.toISOString(),
      userId: newSlot.userId.toString(),
    });
  } catch (err) {
    console.error("Error in POST /api/slots:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Delete slot ---
router.delete("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const slot = await SlotsSubmitted.findById(eventId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Only allow if user owns the slot OR is admin
    if (slot.userId.toString() !== req.userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this slot" });
    }

    await SlotsSubmitted.findByIdAndDelete(eventId);

    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    console.error("Error in DELETE /api/slots/:eventId:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
