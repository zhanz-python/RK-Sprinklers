import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // store as plain YYYY-MM-DD string
  isAvailable: { type: Boolean, default: true },
});

export default mongoose.model("Availability", availabilitySchema);
