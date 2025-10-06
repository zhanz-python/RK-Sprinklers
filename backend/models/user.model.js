import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: false
    },
    street: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    zipCode: {
      type: String,
      required: false
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: String,
    verificationToken: String,
    verificationTokenExpiresAt: String,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);