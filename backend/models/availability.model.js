import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  isAvailable: { type: Boolean, default: true },
});


export default mongoose.model("Availability", availabilitySchema);
