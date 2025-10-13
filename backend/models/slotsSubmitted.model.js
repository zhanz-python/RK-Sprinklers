import mongoose from "mongoose";

const slotsSubmittedSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
    slotDate: { 
      type: Date, 
      required: true 
    },             
    slotNumber: { 
      type: Number, 
      enum: [1, 2, 3], 
      required: true 
    }, 
    status: { 
      type: String, 
      enum: ["pending", "approved", "denied"], 
      default: "pending" 
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export const SlotsSubmitted = mongoose.model("SlotsSubmitted", slotsSubmittedSchema);


