import express from "express";
import Availability from "../models/availability.model.js";

const router = express.Router();

// --- Auto-delete old availability ---
const startAutoDeleteAvailability = () => {
  setInterval(async () => {
    const cutoff = new Date();

    // Cutoff date = availability entries more than 1 month old
    cutoff.setMonth(cutoff.getMonth() - 1);
    const cutoffStr = cutoff.toISOString().split("T")[0];

    try {
      const result = await Availability.deleteMany({ date: { $lt: cutoffStr } });
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

router.post("/toggle", async (req, res) => {
  try {
    // Normalize date -> midnight
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

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
    console.error("Error updating availability:", err);
    res.status(500).json({ error: "Error updating availability" });
  }
});

export default router;