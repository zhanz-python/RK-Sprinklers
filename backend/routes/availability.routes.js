import express from "express";
import Availability from "../models/availability.model.js";

const router = express.Router();

// --- Auto-delete old availability ---
const startAutoDeleteAvailability = () => {
  setInterval(async () => {
    const now = new Date();

    // Cutoff date = availability entries more than 1 month old
    const cutoff = new Date();
    cutoff.setMonth(now.getMonth() - 1);

    try {
      const result = await Availability.deleteMany({ date: { $lt: cutoff } });
      if (result.deletedCount > 0) {
        console.log(`Deleted ${result.deletedCount} availability entries older than 1 month.`);
      }
    } catch (err) {
      console.error("Error auto-deleting old availability:", err);
    }
  }, 60 * 60 * 1000); // run every 1 hour
};

startAutoDeleteAvailability();

// --- Get all availability ---
router.get("/", async (req, res) => {
  try {
    const dates = await Availability.find();
    res.json(dates);
  } catch (err) {
    res.status(500).json({ error: "Error fetching availability" });
  }
});

// --- Toggle availability ---
router.post("/toggle", async (req, res) => {
  const { date } = req.body;
  try {
    // Normalize date -> midnight
    const normalizedDate = new Date(`${date}T00:00:00.000Z`)

    let availability = await Availability.findOne({ date: normalizedDate });
    if (availability) {
      availability.isAvailable = !availability.isAvailable;
      await availability.save();
    } else {
      availability = await Availability.create({
        date: normalizedDate,
        isAvailable: true,
      });
    }

    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: "Error updating availability" });
  }
});

export default router;