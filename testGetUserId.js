// logUsersWithAddress.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./backend/models/user.model.js";

dotenv.config();

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    const users = await User.find();

    if (users.length === 0) {
      console.log("No users found.");
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach((user, i) => {
        const fullAddress = [
          user.street || "",
          user.city || "",
          user.zipCode || "",
        ].filter(Boolean).join(", ") || "N/A";

        console.log(
          `${i + 1}. userId: ${user._id} | name: ${user.name} | email: ${user.email} | number: ${user.number || "N/A"} | address: ${fullAddress} | lastLogin: ${user.lastLogin || "N/A"} | isAdmin: ${user.isAdmin || false}`
        );
      });
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log(" MongoDB disconnected");
  }
}

main();
