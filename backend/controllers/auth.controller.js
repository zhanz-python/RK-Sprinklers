import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { 
    sendVerificationEmail, 
    sendWelcomeEmail, 
    sendPasswordResetEmail, 
    sendResetSuccessEmail 
} from "../mailtrap/emails.js";

import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
    console.log("req.body:", req.body);

    const { email, password, name, number, street, city, zipCode } = req.body;

    try {
        if (!email || !password || !name || !street || !city || !zipCode) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            number,
            street,
            city,
            zipCode,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });

        await user.save();
        generateTokenAndSetCookie(res, user._id);
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: { ...user._doc, password: undefined },
        });
    } catch (error) {
        console.log("Error in signup:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                _id: user._id,              
                name: user.name,
                email: user.email,
                number: user.number,
                address: user.address, // ✅ include address
                isVerified: user.isVerified,
                isAdmin: user.isAdmin || false, 
            },
            token: req.cookies.token,
        });
    } catch (error) {
        console.log("Error in login ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ 
            success: true, 
            user: { 
                ...user._doc, 
                isAdmin: user.isAdmin || false,
                number: user.number,
                address: user.address, // ✅ include address
            } 
        });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "Email already verified" });
        }

        const newVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        user.verificationToken = newVerificationToken;
        user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hrs
        await user.save();

        await sendVerificationEmail(user.email, newVerificationToken);

        res.status(200).json({ success: true, message: "New verification code sent" });
    } catch (error) {
        console.log("Error in resendVerificationEmail:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
