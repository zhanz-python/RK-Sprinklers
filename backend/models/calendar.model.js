import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  slots: {
    type: Number,
    default: 0,
  },
  maxSlots: {
    type: Number,
    default: 3,
  },
  requests: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      serviceType: { type: String, enum: ["sprinklers", "winterization"] },
    }
  ]
});

export const Calendar = mongoose.model("Calendar", calendarSchema);
