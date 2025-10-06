import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE
} from "./emailTemplates.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: true,
  debug: true,
});

transporter.verify((err, success) => {
  if (err) console.error("SMTP connection error:", err);
  else console.log("SMTP server is ready to send emails");
});

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    await transporter.sendMail({
      from: `"RK-Sprinklers" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });
    console.log("Verification email sent to", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"RK-Sprinklers" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to RK-Sprinklers!",
      html: WELCOME_EMAIL_TEMPLATE(name),
    });
    console.log("Welcome email sent to", email);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};


export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    await transporter.sendMail({
      from: `"RK-Sprinklers" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
    console.log("Password reset email sent to", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: `"RK-Sprinklers" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password reset success email sent to", email);
  } catch (error) {
    console.error("Error sending reset success email:", error);
    throw new Error(
      `Error sending password reset success email: ${error.message}`
    );
  }
};


