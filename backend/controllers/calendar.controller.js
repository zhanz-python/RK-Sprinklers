import { Calendar } from "../models/calendar.model.js";

export const addAvailableDate = async (req, res) => {
  try {
    const { date } = req.body;

    let day = await Calendar.findOne({ date });
    if (!day) {
      day = new Calendar({ date, slots: 0 });
      await day.save();
    }

    res.json({ success: true, day });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const requestSlot = async (req, res) => {
  try {
    const { date, serviceType } = req.body;
    const userId = req.user._id;

    let day = await Calendar.findOne({ date });
    if (!day) return res.status(404).json({ success: false, message: "Date not available" });

    if (day.slots >= day.maxSlots) {
      return res.status(400).json({ success: false, message: "No slots left for this date" });
    }

    if (day.requests.some(r => r.userId.toString() === userId.toString())) {
      return res.status(400).json({ success: false, message: "You already requested this date" });
    }

    day.slots += 1;
    day.requests.push({ userId, serviceType });
    await day.save();

    res.json({ success: true, day });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
